import { onMounted, onUnmounted, type MaybeRefOrGetter } from 'vue'
import type { ISupportChatChangedInfoEvent } from '~/domain/support/chat/interfaces/ISupportChatChangedInfoEvent'
import type { ISupportChatMessageCreatedEvent } from '~/domain/support/chat/interfaces/ISupportChatMessageCreatedEvent'
import type { ISupportChatReadMessagesEvent } from '~/domain/support/chat/interfaces/ISupportChatReadMessagesEvent'
import type { ISupportChatWriter } from '~/domain/support/chat/interfaces/ISupportChatWriter'
import type IUser from '~/domain/user/types/IUser'
import { useSupportChatStore } from '~/stores/supportChat/useSupportChatStore'

export interface ISupportChatChannels {
  presenceChannel: any
  privateChannel: any
}

export const channelsList = new Map<number | 'user', ISupportChatChannels>()

export function useSupportChatEcho(chat_id?: MaybeRefOrGetter<number>) {
  const user = useSanctumUser<IUser>()

  const store = useSupportChatStore(chat_id)
  const { updateWritingStatus, appendMessages, updateChatInfo, setReadAt } =
    store
  const { chatInfo, isCurrentUserWriting } = storeToRefs(store)

  const channelKey = chat_id ? toValue(chat_id) : 'user'
  const channelName = chat_id
    ? `support-chat-staff.${toValue(chat_id)}`
    : `support-chat-user.${user.value?.id}`
  const presenceChannelName = `support-chat.${chatInfo.value?.chat_id}`

  const echo = useEcho()

  const echoSubscribe = () => {
    if (!chatInfo.value) {
      console.warn('Chat was not found')
      return
    }

    const channel = {
      presenceChannel: echo.join(presenceChannelName),
      privateChannel: echo.private(channelName),
    }
    channelsList.set(channelKey, channel)

    channel.presenceChannel
      // кто-то присоединился к чату
      .joining(() => {
        if (isCurrentUserWriting.value)
          channel.presenceChannel.whisper('typing-status', {
            id: user.value?.id,
            name: user.value?.name,
            chat_id: chatInfo.value?.chat_id,
            is_writing: true,
          })
      })
      .listenForWhisper('typing-status', (data: ISupportChatWriter) => {
        updateWritingStatus(data)
      })
      // собеседник начал/прекратил печатать
      .listen('.support-chat-writing-status', (data: ISupportChatWriter) => {
        updateWritingStatus(data)
      })

    channel.privateChannel
      // новые сообщения (как от собеседника, так и от себя)
      .listen(
        '.support-chat-message-created',
        (data: ISupportChatMessageCreatedEvent) => {
          // обновлять список сообщений только при получении от собеседника/других сотрудников
          if (
            data.message.author_id !== user.value?.id ||
            data.message.sender_type === 'system'
          ) {
            appendMessages([data.message])
          }

          updateChatInfo(data.chat_info)
        }
      )
      // собеседник прочитал сообщения
      .listen('.support-chat-read', (data: ISupportChatReadMessagesEvent) => {
        if (data.reader_id !== user.value?.id) setReadAt(data.read_messages_ids)
      })
      // был обновлён чат
      .listen(
        '.support-chat-changed-info',
        (data: ISupportChatChangedInfoEvent) => {
          updateChatInfo(data.chat_info)
        }
      )
      .error((err: any) => console.error(err))
  }

  const echoLeave = () => {
    const channel = channelsList.get(channelKey)

    if (channel?.presenceChannel)
      channel.presenceChannel.whisper('typing-status', {
        id: user.value?.id,
        name: user.value?.name,
        is_writing: false,
      })

    echo.leave(channelName)
    echo.leave(presenceChannelName)
  }

  onMounted(() => {
    echoSubscribe()
  })

  onUnmounted(() => {
    echoLeave()
  })

  return {
    echoSubscribe,
    echoLeave,
  }
}
