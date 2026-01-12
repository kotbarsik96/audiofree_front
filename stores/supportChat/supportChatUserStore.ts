import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import type { ISupportChatMessagesDateGroup } from '~/composables/useSupportChat'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'
import type { ISupportChatWriter } from '~/domain/support/chat/interfaces/ISupportChatWriter'
import {
  appendSupportChatMessages,
  groupMessages,
  prependSupportChatMessages,
  setReadAtToMessages,
} from '~/domain/support/chat/utils'

export const useSupportChatUserStore = defineStore('support-chat-user', () => {
  const { $afFetch } = useNuxtApp()

  const chatInfo = ref<ISupportChatInfo>()
  const updateChatInfo = (newInfo: ISupportChatInfo | undefined) => {
    chatInfo.value = newInfo
  }
  const savedScrollPosition = ref<number>()
  const isFirstLoading = ref(false)

  const _messages = ref<ISupportChatMessage[]>([])
  const messagesGroupedByDate = computed(() =>
    groupMessages(_messages, chatInfo)
  )
  const earliestMessageId = computed(() => _messages.value.at(0)?.id)
  const latestMessageId = computed(
    () => _messages.value.at(_messages.value.length - 1)?.id
  )

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

  const currentWriters = ref<ISupportChatWriter[]>([])
  const isCurrentUserWriting = ref(false)
  const updateWritingStatus = (data: ISupportChatWriter) => {
    if (data.is_writing && chatInfo.value?.chat_id === data.chat_id) {
      if (!currentWriters.value.find((wr) => wr.id === data.id))
        currentWriters.value.push(data)
    } else {
      currentWriters.value = currentWriters.value.filter(
        (wr) => wr.id !== data.id
      )
    }
  }

  function prependMessages(messages: ISupportChatMessage[]) {
    prependSupportChatMessages(_messages, messages, chatInfo.value)
  }
  function appendMessages(messages: ISupportChatMessage[]) {
    appendSupportChatMessages(_messages, messages, chatInfo.value)
  }

  /** @param readMessagesIds - список id сообщений, которым выставляется "прочитано". Если список не передан - отметка выставляется всем сообщениям в messages */
  function setReadAt(readMessagesIds?: number[]) {
    setReadAtToMessages(_messages, readMessagesIds)
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
        async onResponse({ response }) {
          if (response.ok) {
            setReadAt(readMessagesIds)
            updateChatInfo(response._data.data.chat_info)
          }
        },
      })
    } catch (err) {
      console.error(err)
    }
  }

  function clear() {
    _messages.value = []
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
    updateChatInfo,
    savedScrollPosition,
    readMessage,
    clear,
    setReadAt,
    refetchChatInfo,
    isFirstLoading,
    currentWriters,
    isCurrentUserWriting,
    updateWritingStatus,
    prependMessages,
    appendMessages,
  }
})
