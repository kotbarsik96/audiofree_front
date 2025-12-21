import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ISupportChatMessagesDateGroup } from '~/composables/useSupportChat'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import type { ISupportChatListItem } from '~/domain/support/chat/interfaces/ISupportChatListItem'

interface ICachedStaffSupportChat {
  chat: string // JSON.stringify
  chat_info: string // JSON.stringify
  earliest_message_id: number | undefined
  latest_message_id: number | undefined
  scroll_position: number | undefined
}

export const useSupportChatStaffStore = defineStore(
  'support-chat-staff',
  () => {
    const _currentChatId = ref<number>()
    const currentChatId = computed(() => _currentChatId.value)
    const changeChat = (newChatId: number) => {
      cacheCurrentChat()
      restoreCachedChat(newChatId)
    }

    const messagesGroupedByDate = ref<ISupportChatMessagesDateGroup[]>([])
    const earliestMessageId = ref<number | undefined>()
    const latestMessageId = ref<number | undefined>()
    const cachedChats = ref<Record<number, ICachedStaffSupportChat>>({})
    const savedScrollPosition = ref<number>()

    const chatInfo = ref<ISupportChatInfo>()

    const chatsList = shallowRef<ISupportChatListItem[]>([])
    const chatsListTrigger = ref(0)
    const triggerChatsListRefresh = () => chatsListTrigger.value++

    function cacheCurrentChat() {
      if (!_currentChatId.value) return

      const stringifiedMessages = JSON.stringify(messagesGroupedByDate.value)
      const stringifiedChatInfo = JSON.stringify(chatInfo.value)
      cachedChats.value[_currentChatId.value] = {
        chat: stringifiedMessages,
        chat_info: stringifiedChatInfo,
        earliest_message_id: earliestMessageId.value,
        latest_message_id: latestMessageId.value,
        scroll_position: savedScrollPosition.value,
      }
    }

    function restoreCachedChat(restoredChatId: number) {
      _currentChatId.value = restoredChatId
      const foundCached: ICachedStaffSupportChat | undefined =
        cachedChats.value[_currentChatId.value]

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

    return {
      currentChatId,
      changeChat,
      messagesGroupedByDate,
      earliestMessageId,
      latestMessageId,
      savedScrollPosition,
      chatInfo,
      chatsList,
      chatsListTrigger,
      triggerChatsListRefresh,
    }
  }
)
