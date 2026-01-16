import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useWritersList } from '~/domain/support/chat/composeables/useWritersList'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import type { ISupportChatListItem } from '~/domain/support/chat/interfaces/ISupportChatListItem'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'
import type { ISupportChatWriter } from '~/domain/support/chat/interfaces/ISupportChatWriter'
import { supportChatCache } from '~/domain/support/chat/SupportChatCache'
import { supportChatPresenceChannels } from '~/domain/support/chat/SupportChatPresenceChannels'
import {
  appendSupportChatMessages,
  groupMessages,
  prependSupportChatMessages,
  setReadAtToMessages,
} from '~/domain/support/chat/utils'
import type IUser from '~/domain/user/types/IUser'

interface IReadMessageByChatData {
  messagesIds: number[]
  timeout: ReturnType<typeof setTimeout> | undefined
}

export const useSupportChatStaffStore = defineStore(
  'support-chat-staff',
  () => {
    const { $afFetch } = useNuxtApp()

    const user = useSanctumUser<IUser>()

    const echo = useEcho()

    const { writersList, updateWriters } = useWritersList()

    const isFirstLoading = ref(false)

    const savedScrollPosition = ref<number>()

    const messages = ref<ISupportChatMessage[]>([])
    const messagesGroupedByDate = computed(() => groupMessages(messages))

    const earliestMessageId = computed(() => messages.value.at(0)?.id)
    const latestMessageId = computed(
      () => messages.value.at(messages.value.length - 1)?.id
    )

    const chatInfo = ref<ISupportChatInfo>()
    const currentChatId = computed(() => chatInfo.value?.chat_id)
    /** обновляет текущий chatInfo если newInfo.id совпадает с chatInfo.id. Иначе ищет сохранённый чат в кэше и обновляет его там */
    const updateChatInfo = (newInfo: ISupportChatInfo | undefined) => {
      if (newInfo) {
        if (chatInfo.value?.chat_id === newInfo.chat_id)
          chatInfo.value = newInfo
      }
    }

    const allEarlierMessagesLoaded = computed(
      () =>
        earliestMessageId.value &&
        earliestMessageId.value <= (chatInfo.value?.first_message_id ?? 0)
    )
    const allLaterMessagesLoaded = computed(
      () =>
        latestMessageId.value &&
        latestMessageId.value >= (chatInfo.value?.last_message_id ?? 0)
    )

    const chatsList = shallowRef<ISupportChatListItem[]>([])

    /** массивы списков id прочитанных сообщений по чатам:
     * ключ number - chat_id,
     * значение number[] - список id прочитанных сообщений в этом чате
     * */
    const _readMessagesByChats = ref<Record<number, IReadMessageByChatData>>({})
    /** прочитать сообщение. messageId добавляется в массив _readMessagesByChats[chat_id].messagesIds и перезапускается таймер, по окончанию которого собранный список прочитанных сообщений отправляется на бэк
     */
    const readMessage = (messageId: number) => {
      const chat_id = toValue(currentChatId)
      if (chat_id) {
        let data = _readMessagesByChats.value[chat_id]
        if (!data) {
          _readMessagesByChats.value[chat_id] = {
            messagesIds: [],
            timeout: undefined,
          }
          data = _readMessagesByChats.value[chat_id]
        }

        if (!data.messagesIds.includes(messageId)) {
          data.messagesIds.push(messageId)

          if (data.timeout) clearTimeout(data.timeout)
          data.timeout = setTimeout(async () => {
            const sorted = data.messagesIds.sort((id1, id2) => id1 - id2)
            await submitReadMessages(sorted, chat_id)
            data.messagesIds = []
            data.timeout = undefined
          }, 250)
        }
      }
    }

    const isCurrentUserWriting = ref(false)
    const whisperWritingStatus = (
      is_writing: boolean,
      chat_id: number | undefined
    ) => {
      if (chat_id) {
        const channel = supportChatPresenceChannels.getChannel(chat_id)

        channel?.whisper('typing-status', {
          id: user.value?.id,
          chat_id,
          name: user.value?.name,
          started_writing_at: is_writing ? Date.now() : false,
        })
      }
    }

    function prependMessages(newMessages: ISupportChatMessage[]) {
      prependSupportChatMessages(messages, newMessages, chatInfo.value)
    }
    function appendMessages(newMessages: ISupportChatMessage[]) {
      appendSupportChatMessages(messages, newMessages, chatInfo.value)
    }

    function joinStaffPresenceChannelIfNot(chatId: number) {
      if (!supportChatPresenceChannels.hasChannel(chatId)) {
        // регистрирует presence channel на данный чат
        const presenceChannel = supportChatPresenceChannels.register(
          chatId,
          echo
        )

        presenceChannel
          // если кто-то присоединился в этот чат
          .joining(() => {
            // при этом этот чат открыт текущим пользователем сейчас (+ текущий пользователь в данный момент печатает)
            if (isCurrentUserWriting.value && chatId === currentChatId.value)
              // оповестить всех в чате о том, что текущий пользователь печатает
              whisperWritingStatus(true, chatId)
          })
          // кто-то другой оповещает о том, что начал печатать
          .listenForWhisper('typing-status', (data: ISupportChatWriter) => {
            updateWriters(data)
          })
      }
    }

    /** @param readMessagesIds - список id сообщений, которым выставляется "прочитано". Если список не передан - отметка выставляется всем сообщениям в messages */
    function setReadAt(readMessagesIds?: number[]) {
      setReadAtToMessages(messages.value, readMessagesIds)
    }

    async function submitReadMessages(
      readMessagesIds: number[],
      chat_id: number
    ) {
      if (readMessagesIds.length < 1) return

      try {
        await $afFetch('/support-chat/read', {
          method: 'POST',
          credentials: 'include',
          body: {
            chat_id,
            first_read_message_id: readMessagesIds[0],
            read_count: readMessagesIds.length,
          },
          async onResponse({ response }) {
            if (response.ok) {
              // если чат не менялся - поменять значения read_at только локально
              if (chat_id === currentChatId.value) {
                setReadAt(readMessagesIds)
              }
              // если чат менялся - поменять значения read_at внутри кэша
              else {
                const cachedChat = supportChatCache.getChat(chat_id)
                if (cachedChat)
                  setReadAtToMessages(cachedChat.messages, readMessagesIds)
              }

              updateChatInfo(response._data.data.chat_info)
            }
          },
        })
      } catch (err) {
        console.error(err)
      }
    }

    return {
      currentChatId,
      readMessage,
      messagesGroupedByDate,
      earliestMessageId,
      latestMessageId,
      savedScrollPosition,
      chatInfo,
      chatsList,
      updateChatInfo,
      setReadAt,
      isFirstLoading,
      writersList,
      updateWriters,
      prependMessages,
      appendMessages,
      messages,
      allEarlierMessagesLoaded,
      allLaterMessagesLoaded,
      joinStaffPresenceChannelIfNot,
      isCurrentUserWriting,
      whisperWritingStatus,
    }
  }
)
