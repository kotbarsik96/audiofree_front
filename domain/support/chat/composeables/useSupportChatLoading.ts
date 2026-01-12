import type { MaybeRefOrGetter } from 'vue'
import { useSupportChatStore } from '~/stores/supportChat/useSupportChatStore'

export function useSupportChatLoading(chat_id?: MaybeRefOrGetter<number>) {
  const { addNotification } = useNotifications()
  const { $afFetch } = useNuxtApp()

  const store = useSupportChatStore(chat_id)
  const { prependMessages, appendMessages, updateChatInfo } = store
  const storeRefs = storeToRefs(store)
  const { earliestMessageId, latestMessageId, chatInfo } = storeRefs

  async function loadMoreEarlier() {
    try {
      await $afFetch('/support-chat/messages', {
        query: {
          earliest_message_id: earliestMessageId.value,
          chat_id: toValue(chat_id),
        },
        credentials: 'include',
        onResponse({ response }) {
          const { messages: loadedMessages } = response._data.data

          prependMessages(loadedMessages)
        },
      })
    } catch (err) {
      addNotification('error', 'Не удалось загрузить ранние сообщения')
    }
  }

  async function loadMoreLater(load_all?: boolean) {
    try {
      await $afFetch('/support-chat/messages', {
        query: {
          latest_message_id: latestMessageId.value,
          chat_id: toValue(chat_id),
          load_all,
        },
        credentials: 'include',
        onResponse({ response }) {
          const { messages: loadedMessages } = response._data.data

          appendMessages(loadedMessages)
        },
      })
    } catch (err) {
      addNotification('error', 'Не удалось загрузить новые сообщения')
    }
  }

  async function refetchChatInfo() {
    const updatingChatId = chatInfo.value?.chat_id

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
    loadMoreEarlier,
    loadMoreLater,
    refetchChatInfo,
  }
}
