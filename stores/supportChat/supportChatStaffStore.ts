import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  useSupportChatLoading,
  type ISupportChatMessagesDateGroup,
} from '~/composables/useSupportChat'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import type { ISupportChatListItem } from '~/domain/support/chat/interfaces/ISupportChatListItem'
import { setReadAtToMessages } from '~/domain/support/chat/utils'

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

const __MAX_CACHED_CHATS__ = 4

export const useSupportChatStaffStore = defineStore(
  'support-chat-staff',
  () => {
    const { $afFetch } = useNuxtApp()

    const _currentChatId = ref<number>()
    const currentChatId = computed(() => _currentChatId.value)
    const changeChat = async (newChatId: number) => {
      cacheCurrentChat()
      restoreCachedChatOrReset(newChatId)
      if (!!getCachedChat(newChatId) && chatInfo.value) {
        await loadMoreLater(true)
        await refetchChatInfo()
      }
    }

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

    const messagesGroupedByDate = ref<ISupportChatMessagesDateGroup[]>([])
    const earliestMessageId = ref<number | undefined>()
    const latestMessageId = ref<number | undefined>()
    const cachedChats = ref<ICachedStaffSupportChat[]>([])
    const getCachedChat = (chatId: number) =>
      cachedChats.value.find((cached) => cached.chat_id === chatId)
    const savedScrollPosition = ref<number>()

    const chatInfo = ref<ISupportChatInfo>()
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

    const { loadMoreLater } = useSupportChatLoading(
      earliestMessageId,
      latestMessageId,
      messagesGroupedByDate,
      chatInfo,
      currentChatId
    )

    function cacheCurrentChat() {
      // todo: добавить лимит на кэш и если превышает лимит - убирать самый старый кэшированный чат

      if (
        !_currentChatId.value ||
        !messagesGroupedByDate.value ||
        !chatInfo.value
      )
        return

      // подготовить кэш
      const stringifiedMessages = JSON.stringify(messagesGroupedByDate.value)
      const stringifiedChatInfo = JSON.stringify(chatInfo.value)
      const data = {
        chat_id: chatInfo.value.chat_id,
        chat: stringifiedMessages,
        chat_info: stringifiedChatInfo,
        earliest_message_id: earliestMessageId.value,
        latest_message_id: latestMessageId.value,
        scroll_position: savedScrollPosition.value,
      }

      const cachedChatIndex = cachedChats.value.findIndex(
        (cached) => cached.chat_id === _currentChatId.value
      )
      // если чат уже кэширован - перезаписать его
      if (cachedChatIndex >= 0)
        cachedChats.value.splice(cachedChatIndex, 1, data)
      // иначе просто добавить в кэш
      else cachedChats.value.push(data)

      // количество кэшированных чатов не должно превышать лимит
      if (cachedChats.value.length > __MAX_CACHED_CHATS__) {
        const startIndex = cachedChats.value.length - __MAX_CACHED_CHATS__
        cachedChats.value = cachedChats.value.slice(startIndex)
      }
    }

    /** Если чат есть в кэше - восстановит его. В ином случае сбросит все состояния */
    function restoreCachedChatOrReset(restoredChatId: number) {
      _currentChatId.value = restoredChatId
      const foundCached: ICachedStaffSupportChat | undefined = getCachedChat(
        _currentChatId.value
      )

      if (foundCached) {
        chatInfo.value = JSON.parse(foundCached.chat_info)
        messagesGroupedByDate.value = JSON.parse(foundCached.chat)
        earliestMessageId.value = foundCached.earliest_message_id
        latestMessageId.value = foundCached.latest_message_id
        savedScrollPosition.value = foundCached.scroll_position
      } else {
        chatInfo.value = undefined
        messagesGroupedByDate.value = []
        earliestMessageId.value = undefined
        latestMessageId.value = undefined
        savedScrollPosition.value = undefined
      }
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
                setReadAtToMessages(
                  messagesGroupedByDate.value,
                  readMessagesIds
                )
              }
              // если чат менялся - поменять значения read_at внутри кэша
              else {
                const foundCached = getCachedChat(chat_id)
                if (foundCached) {
                  const cachedChat = JSON.parse(
                    foundCached.chat
                  ) as ISupportChatMessagesDateGroup[]
                  setReadAtToMessages(cachedChat, readMessagesIds)
                  foundCached.chat = JSON.stringify(cachedChat)
                }
              }

              updateChatInfo(response._data.data.chat_info)
            }
          },
        })
      } catch (err) {
        console.error(err)
      }
    }

    async function refetchChatInfo() {
      const updatingChatId = toValue(currentChatId)

      try {
        await $afFetch('/support-chat', {
          credentials: 'include',
          query: {
            chat_id: updatingChatId,
          },
          onResponse({ response }) {
            if (response.ok) {
              const updatedChatInfo = response._data.data
              updateChatInfo(updatedChatInfo)
            }
          },
        })
      } catch (err) {
        console.error(err)
      }
    }

    return {
      currentChatId,
      changeChat,
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
      refetchChatInfo,
      isFirstLoading,
    }
  }
)
