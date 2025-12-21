import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import type { ISupportChatMessagesDateGroup } from '~/composables/useSupportChat'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'

export const useSupportChatUserStore = defineStore('support-chat-user', () => {
  const messagesGroupedByDate = shallowRef<ISupportChatMessagesDateGroup[]>([])
  const earliestMessageId = ref<number>()
  const latestMessageId = ref<number>()
  const chatInfo = ref<ISupportChatInfo>()
  const savedScrollPosition = ref<number>()

  const _readMessagesIds = ref<number[]>([])
  const readMessage = (messageId: number) => {}

  return {
    messagesGroupedByDate,
    earliestMessageId,
    latestMessageId,
    chatInfo,
    savedScrollPosition,
    readMessage,
  }
})
