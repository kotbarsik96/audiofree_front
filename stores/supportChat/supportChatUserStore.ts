import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ISupportChatMessagesDateGroup } from '~/composables/useSupportChat'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import { setReadAtToMessages } from '~/domain/support/chat/utils'

export const useSupportChatUserStore = defineStore('support-chat-user', () => {
  const { $afFetch } = useNuxtApp()

  const messagesGroupedByDate = ref<ISupportChatMessagesDateGroup[]>([])
  const earliestMessageId = ref<number>()
  const latestMessageId = ref<number>()
  const chatInfo = ref<ISupportChatInfo>()
  const savedScrollPosition = ref<number>()

  const _readMessagesIds = ref<number[]>([])
  let _readMessagesSubmitTimeout: ReturnType<typeof setTimeout> | undefined =
    undefined
  const readMessage = (messageId: number) => {
    if (!_readMessagesIds.value.includes(messageId)) {
      _readMessagesIds.value.push(messageId)

      if (_readMessagesSubmitTimeout) clearTimeout(_readMessagesSubmitTimeout)
      _readMessagesSubmitTimeout = setTimeout(async () => {
        const sorted = _readMessagesIds.value.sort((id1, id2) => id1 - id2)
        await submitReadMessages(sorted)
        _readMessagesIds.value = []
        _readMessagesSubmitTimeout = undefined
      }, 250)
    }
  }

  async function submitReadMessages(readMessagesIds: number[]) {
    if (readMessagesIds.length < 1) return

    try {
      await $afFetch('/support-chat/read', {
        method: 'POST',
        credentials: 'include',
        body: {
          first_read_message_id: readMessagesIds[0],
          read_count: readMessagesIds.length,
        },
        onResponse({ response }) {
          if (response.ok) {
            setReadAtToMessages(messagesGroupedByDate.value, readMessagesIds)
          }
        },
      })
    } catch (err) {
      console.error(err)
    }
  }

  function clear() {
    messagesGroupedByDate.value = []
    earliestMessageId.value = undefined
    latestMessageId.value = undefined
    chatInfo.value = undefined
    savedScrollPosition.value = undefined
    _readMessagesIds.value = []
  }

  async function refetchChatInfo() {
    try {
      await $afFetch('/support-chat', {
        credentials: 'include',
        onResponse({ response }) {
          if (response.ok) {
            const updatedChatInfo = response._data.data
            chatInfo.value = updatedChatInfo
          }
        },
      })
    } catch (err) {
      console.error(err)
    }
  }

  return {
    messagesGroupedByDate,
    earliestMessageId,
    latestMessageId,
    chatInfo,
    savedScrollPosition,
    readMessage,
    clear,
    refetchChatInfo,
  }
})
