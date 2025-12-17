import type { ShallowRef } from 'vue'
import type { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'
import type { ISupportChatMessagesList } from '~/domain/support/chat/interfaces/ISupportChatMessagesList'

export interface ISupportChatFormattedMessagesDate {
  date: string
}

export interface ISupportChatFormattedMessagesGroup {
  sender_type: ESupportChatSenderType
  group: ISupportChatMessage[]
}

export type TFormattedMessages = (
  | ISupportChatFormattedMessagesGroup
  | ISupportChatFormattedMessagesDate
)[]

export async function useSupportChat(
  topSpy: ShallowRef<HTMLElement | null>,
  bottomSpy: ShallowRef<HTMLElement | null>,
  chat_id?: MaybeRefOrGetter<number>
) {
  onMounted(() => {
    initTopObserver()
    initBottomObserver()
  })

  onUnmounted(() => {
    if (topSpyObserver) topSpyObserver.disconnect()
    if (bottomSpyObserver) bottomSpyObserver.disconnect()
  })

  const { addNotification } = useNotifications()

  const { $afFetch } = useNuxtApp()

  const [
    { data: chatInfoData, error: chatInfoError },
    { data: messagesData, error: messagesError },
  ] = await Promise.all([
    useAPI<{ data: ISupportChatInfo }>('/support-chat/', {
      credentials: 'include',
      query: {
        chat_id,
      },
      watch: false,
    }),
    useAPI<{ data: ISupportChatMessagesList }>('/support-chat/messages', {
      credentials: 'include',
      query: {
        chat_id,
      },
      watch: false,
    }),
  ])

  if (chatInfoError.value) throw createError(chatInfoError.value)
  if (messagesError.value) throw createError(messagesError.value)

  const chatInfo = computed(() => chatInfoData.value)

  const messages = ref<TFormattedMessages>(
    formatAndAppendMessages([], messagesData.value?.data.messages ?? [])
  )
  const earliestMessageId = ref(messagesData.value?.data.earliest_loaded_id)
  const latestMessageId = ref(messagesData.value?.data.latest_loaded_id)

  let topSpyObserver: IntersectionObserver
  let bottomSpyObserver: IntersectionObserver
  const initTopObserver = () => {
    if (topSpy.value) {
      topSpyObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          if (entries.find((entry) => entry.isIntersecting)) _loadMoreTop()
        },
        {}
      )
    }
  }
  const initBottomObserver = () => {
    if (bottomSpy.value) {
      bottomSpyObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          if (entries.find((entry) => entry.isIntersecting)) _loadMoreBottom()
        },
        {}
      )
    }
  }

  async function _loadMoreTop() {
    try {
      await $afFetch('/support-chat/messages', {
        query: {
          earliest_message_id: earliestMessageId.value,
          chat_id: toValue(chat_id),
        },
        credentials: 'include',
        onResponse({ response }) {
          const { messages: loadedMessages, earliest_loaded_id } =
            response._data.data

          earliestMessageId.value = earliest_loaded_id
          messages.value = formatAndPrependMessages(
            messages.value,
            loadedMessages
          )
        },
      })
    } catch (err) {
      addNotification('error', 'Не удалось загрузить ранние сообщения')
    }
  }
  async function _loadMoreBottom() {
    try {
      await $afFetch('/support-chat/messages', {
        query: {
          latest_message_id: latestMessageId.value,
          chat_id: toValue(chat_id),
        },
        credentials: 'include',
        onResponse({ response }) {
          const { messages: loadedMessages, latest_loaded_id } =
            response._data.data

          earliestMessageId.value = latest_loaded_id
          messages.value = formatAndAppendMessages(
            messages.value,
            loadedMessages
          )
        },
      })
    } catch (err) {
      addNotification('error', 'Не удалось загрузить новые сообщения')
    }
  }

  return {
    chatInfo,
    messages,
    earliestMessageId,
    latestMessageId,
  }
}

function formatAndPrependMessages(
  currentArray: TFormattedMessages,
  messages: ISupportChatMessage[]
) {
  const arr: TFormattedMessages = [...currentArray]

  const prependDateIfNeeded = (
    messageCreatedAt: string,
    firstArrayDate?: ISupportChatFormattedMessagesDate
  ) => {
    if (firstArrayDate) {
      const lastDate = new Date(firstArrayDate.date)
      const msgDate = new Date(messageCreatedAt)
      const isSameDate = checkSameDate(lastDate, msgDate)

      if (!isSameDate) arr.unshift({ date: messageCreatedAt })
    } else arr.push({ date: messageCreatedAt })
  }

  let currentGroup: ISupportChatFormattedMessagesGroup | null = null

  for (let message of messages.reverse()) {
    const firstArrayDate = arr.find((item) => 'date' in item)
    prependDateIfNeeded(message.created_at, firstArrayDate)

    const dateIsFirst = 'date' in (arr.at(arr.length - 1) ?? {})

    let firstGroup: ISupportChatFormattedMessagesGroup
    if (
      dateIsFirst ||
      !currentGroup ||
      currentGroup.sender_type !== message.sender_type
    ) {
      firstGroup = { group: [], sender_type: message.sender_type }
      arr.unshift(firstGroup)
      currentGroup = firstGroup
    } else firstGroup = currentGroup

    firstGroup.group.unshift(message)
  }

  return currentArray
}

function formatAndAppendMessages(
  currentArray: TFormattedMessages,
  messages: ISupportChatMessage[]
) {
  let arr: TFormattedMessages = [...currentArray]

  const pushDateIfNeeded = (
    messageCreatedAt: string,
    lastArrayDate?: ISupportChatFormattedMessagesDate
  ) => {
    if (lastArrayDate) {
      const lastDate = new Date(lastArrayDate.date)
      const msgDate = new Date(messageCreatedAt)
      const isSameDate = checkSameDate(lastDate, msgDate)

      if (!isSameDate) arr.push({ date: messageCreatedAt })
    } else arr.push({ date: messageCreatedAt })
  }

  let currentGroup: ISupportChatFormattedMessagesGroup | null = null

  for (let message of messages) {
    const lastArrayDate = arr.findLast((item) => 'date' in item)
    pushDateIfNeeded(message.created_at, lastArrayDate)

    const dateIsLast = 'date' in (arr.at(arr.length - 1) ?? {})

    let lastGroup: ISupportChatFormattedMessagesGroup
    if (
      dateIsLast ||
      !currentGroup ||
      currentGroup.sender_type !== message.sender_type
    ) {
      lastGroup = { group: [], sender_type: message.sender_type }
      arr.push(lastGroup)
      currentGroup = lastGroup
    } else lastGroup = currentGroup

    lastGroup.group.push(message)
  }

  return arr
}

function checkSameDate(dateFirst: Date, dateSecond: Date) {
  const isSameDay = dateFirst.getDate() === dateSecond.getDate()
  const isSameMonth = dateFirst.getMonth() === dateSecond.getMonth()
  const isSameYear = dateFirst.getFullYear() === dateSecond.getFullYear()
  return isSameDay && isSameMonth && isSameYear
}
