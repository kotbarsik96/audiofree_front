import { type MaybeRefOrGetter } from 'vue'
import type { ISupportChatChangedInfoEvent } from '~/domain/support/chat/interfaces/ISupportChatChangedInfoEvent'
import type { ISupportChatMessageCreatedEvent } from '~/domain/support/chat/interfaces/ISupportChatMessageCreatedEvent'
import type { ISupportChatReadMessagesEvent } from '~/domain/support/chat/interfaces/ISupportChatReadMessagesEvent'
import type IUser from '~/domain/user/types/IUser'
import { useSupportChatStore } from '~/stores/supportChat/useSupportChatStore'

export function useSupportChatEcho(chat_id?: MaybeRefOrGetter<number>) {
  const user = useSanctumUser<IUser>()

  const store = useSupportChatStore(chat_id)
  const { appendMessages, setReadAt, updateChatInfo } = store
  const { chatInfo } = storeToRefs(store)

  const echo = useEcho()
  const privateChannelName = chat_id
    ? `support-chat-staff.${toValue(chat_id)}`
    : `support-chat-user.${user.value?.id}`

  const echoSubscribe = () => {
    if (!chatInfo.value) {
      console.warn('Chat was not found')
      return
    }

    echo
      .private(privateChannelName)
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
    echo.leave(privateChannelName)
  }

  return {
    echoSubscribe,
    echoLeave,
  }
}
