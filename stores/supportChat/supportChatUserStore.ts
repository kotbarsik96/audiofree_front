import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { useWritersList } from '~/domain/support/chat/composeables/useWritersList'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'
import type { ISupportChatWriter } from '~/domain/support/chat/interfaces/ISupportChatWriter'
import { supportChatPresenceChannels } from '~/domain/support/chat/SupportChatPresenceChannels'
import {
  appendSupportChatMessages,
  groupMessages,
  prependSupportChatMessages,
  setReadAtToMessages,
} from '~/domain/support/chat/utils'
import type IUser from '~/domain/user/types/IUser'

export const useSupportChatUserStore = defineStore('support-chat-user', () => {
  const { $afFetch } = useNuxtApp()

  const user = useSanctumUser<IUser>()

  const { writersList, updateWriters } = useWritersList()

  const echo = useEcho()

  const isFirstLoading = ref(false)

  const savedScrollPosition = ref<number>()

  const messages = ref<ISupportChatMessage[]>([])
  const messagesGroupedByDate = computed(() => groupMessages(messages))

  const earliestMessageId = computed(() => messages.value.at(0)?.id)
  const latestMessageId = computed(
    () => messages.value.at(messages.value.length - 1)?.id
  )

  const chatInfo = ref<ISupportChatInfo>()
  const updateChatInfo = (newInfo: ISupportChatInfo | undefined) => {
    chatInfo.value = newInfo
  }

  const currentChatId = computed(() => chatInfo.value?.chat_id)

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

  const isCurrentUserWriting = ref(false)
  const whisperWritingStatus = (is_writing: boolean) => {
    if (currentChatId.value) {
      const channel = supportChatPresenceChannels.getChannel(
        currentChatId.value
      )

      channel?.whisper('typing-status', {
        id: user.value?.id,
        chat_id: currentChatId.value,
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

  /** @param readMessagesIds - список id сообщений, которым выставляется "прочитано". Если список не передан - отметка выставляется всем сообщениям в messages */
  function setReadAt(readMessagesIds?: number[]) {
    setReadAtToMessages(messages.value, readMessagesIds)
  }

  function joinUserPresenceChannelIfNot() {
    if (
      currentChatId.value &&
      !supportChatPresenceChannels.hasChannel(currentChatId.value)
    ) {
      // регистрирует presence channel на данный чат
      const presenceChannel = supportChatPresenceChannels.register(
        currentChatId.value,
        echo
      )

      presenceChannel
        // если кто-то присоединился в этот чат
        .joining(() => {
          // при этом текущий пользователь в данный момент пишет
          if (isCurrentUserWriting.value)
            // оповестить всех в чате о том, что текущий пользователь печатает
            whisperWritingStatus(true)
        })
        // кто-то оповещает о том, что начал печатать
        .listenForWhisper('typing-status', (data: ISupportChatWriter) => {
          updateWriters(data)
        })
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

  return {
    currentChatId,
    messagesGroupedByDate,
    earliestMessageId,
    latestMessageId,
    chatInfo,
    updateChatInfo,
    savedScrollPosition,
    readMessage,
    setReadAt,
    isFirstLoading,
    writersList,
    updateWriters,
    prependMessages,
    appendMessages,
    messages,
    allEarlierMessagesLoaded,
    allLaterMessagesLoaded,
    joinUserPresenceChannelIfNot,
    isCurrentUserWriting,
    whisperWritingStatus,
  }
})
