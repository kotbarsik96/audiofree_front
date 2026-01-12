import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import type { ISupportChatListItem } from '~/domain/support/chat/interfaces/ISupportChatListItem'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'
import type { ISupportChatWriter } from '~/domain/support/chat/interfaces/ISupportChatWriter'
import { supportChatCache } from '~/domain/support/chat/SupportChatCache'
import {
  appendSupportChatMessages,
  groupMessages,
  prependSupportChatMessages,
  setReadAtToMessages,
} from '~/domain/support/chat/utils'

interface ICachedStaffSupportChat {
  chat_id: number
  chat: string // JSON.stringify<ISupportChatMessagesDateGroup[]>
  chat_info: string // JSON.stringify<ISupportChatInfo>
  earliest_message_id: number | undefined
  latest_message_id: number | undefined
  scroll_position: number | undefined
}

interface IReadMessageByChatData {
  messagesIds: number[]
  timeout: ReturnType<typeof setTimeout> | undefined
}

export const useSupportChatStaffStore = defineStore(
  'support-chat-staff',
  () => {
    const { $afFetch } = useNuxtApp()

    const isFirstLoading = ref(false)

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

    const cachedChats = ref<ICachedStaffSupportChat[]>([])
    const getCachedChat = (chatId: number) =>
      cachedChats.value.find((cached) => cached.chat_id === chatId)
    const savedScrollPosition = ref<number>()

    const messages = ref<ISupportChatMessage[]>([])
    const messagesGroupedByDate = computed(() =>
      groupMessages(messages, chatInfo)
    )
    const earliestMessageId = computed(() => messages.value.at(0)?.id)
    const latestMessageId = computed(
      () => messages.value.at(messages.value.length - 1)?.id
    )

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

    const chatInfo = ref<ISupportChatInfo>()
    const currentChatId = computed(() => chatInfo.value?.chat_id)
    /** обновляет текущий chatInfo если newInfo.id совпадает с chatInfo.id. Иначе ищет сохранённый чат в кэше и обновляет его там */
    const updateChatInfo = (newInfo: ISupportChatInfo | undefined) => {
      if (newInfo) {
        if (chatInfo.value?.chat_id === newInfo.chat_id)
          chatInfo.value = newInfo
        else {
          const cached = getCachedChat(newInfo.chat_id)
          if (cached) cached.chat_info = JSON.stringify(newInfo)
        }
      }
    }

    const chatsList = shallowRef<ISupportChatListItem[]>([])

    const currentWriters = ref<ISupportChatWriter[]>([])
    const isCurrentUserWriting = ref(false)
    const chatsListWriters = ref<ISupportChatWriter[]>([])
    const updateWritingStatus = (data: ISupportChatWriter) => {
      if (data.is_writing) {
        const isInCurrentWriters = currentWriters.value.find(
          (wr) => wr.id === data.id
        )
        if (!isInCurrentWriters && data.chat_id === currentChatId.value)
          currentWriters.value.push(data)

        const isInChatsListWriters = chatsListWriters.value.find(
          (wr) => wr.id === data.id
        )
        if (!isInChatsListWriters) chatsListWriters.value.push(data)
      } else {
        currentWriters.value = currentWriters.value.filter(
          (wr) => wr.id !== data.id
        )

        const i = chatsListWriters.value.findIndex(
          (wr) => wr.chat_id === data.chat_id && wr.id === data.id
        )
        if (i >= 0) chatsListWriters.value.splice(i, 1)
      }
    }

    function prependMessages(newMessages: ISupportChatMessage[]) {
      prependSupportChatMessages(messages, newMessages, chatInfo.value)
    }
    function appendMessages(newMessages: ISupportChatMessage[]) {
      appendSupportChatMessages(messages, newMessages, chatInfo.value)
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
      cachedChats,
      getCachedChat,
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
      currentWriters,
      isCurrentUserWriting,
      chatsListWriters,
      updateWritingStatus,
      prependMessages,
      appendMessages,
      messages,
      allEarlierMessagesLoaded,
      allLaterMessagesLoaded,
    }
  }
)
