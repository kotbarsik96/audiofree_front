import type { ShallowRef } from 'vue'
import type { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'
import type { ISupportChatMessagesList } from '~/domain/support/chat/interfaces/ISupportChatMessagesList'

export interface ISupportChatMessagesDateGroup {
  date: string
  groups: ISupportChatMessageSenderGroup[]
}

export interface ISupportChatMessageSenderGroup {
  sender_type: ESupportChatSenderType
  messages: ISupportChatMessage[]
}

export async function useSupportChat(
  chatBodyElement: ShallowRef<HTMLElement | null>,
  topSpyElement: ShallowRef<HTMLElement | null>,
  bottomSpyElement: ShallowRef<HTMLElement | null>,
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

  const groupedByDateMessages = ref<ISupportChatMessagesDateGroup[]>(
    formatAndAppendMessages([], messagesData.value?.data.messages ?? [])
  )
  const earliestMessageId = ref(messagesData.value?.data.earliest_loaded_id)
  const latestMessageId = ref(messagesData.value?.data.latest_loaded_id)

  let topSpyObserver: IntersectionObserver
  let bottomSpyObserver: IntersectionObserver
  const initTopObserver = () => {
    if (topSpyElement.value && chatBodyElement.value) {
      topSpyObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          if (entries.find((entry) => entry.isIntersecting)) _loadMoreTop()
        },
        {
          root: chatBodyElement.value,
          rootMargin: '200px 0px 0px 0px',
        }
      )
      topSpyObserver.observe(topSpyElement.value)
    }
  }
  const initBottomObserver = () => {
    if (bottomSpyElement.value) {
      bottomSpyObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          if (entries.find((entry) => entry.isIntersecting)) _loadMoreBottom()
        },
        {
          root: chatBodyElement.value,
        }
      )
      bottomSpyObserver.observe(bottomSpyElement.value)
    }
  }

  async function _loadMoreTop() {
    if (!earliestMessageId.value) return

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

          const heightBefore = chatBodyElement.value?.scrollHeight ?? 0

          earliestMessageId.value = earliest_loaded_id
          groupedByDateMessages.value = formatAndPrependMessages(
            groupedByDateMessages.value,
            loadedMessages
          )

          nextTick().then(() => {
            const heightAfter = chatBodyElement.value?.scrollHeight ?? 0
            const diff = heightAfter - heightBefore

            chatBodyElement.value?.scrollTo({
              top: chatBodyElement.value.scrollTop + diff,
            })
          })
        },
      })
    } catch (err) {
      addNotification('error', 'Не удалось загрузить ранние сообщения')
    }
  }
  async function _loadMoreBottom() {
    if (!latestMessageId.value) return

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

          const heightBefore = chatBodyElement.value?.scrollHeight ?? 0

          latestMessageId.value = latest_loaded_id
          groupedByDateMessages.value = formatAndAppendMessages(
            groupedByDateMessages.value,
            loadedMessages
          )

          nextTick().then(() => {
            const heightAfter = chatBodyElement.value?.scrollHeight ?? 0
            const diff = heightAfter - heightBefore

            chatBodyElement.value?.scrollTo({
              top: chatBodyElement.value.scrollTop - diff,
            })
          })
        },
      })
    } catch (err) {
      addNotification('error', 'Не удалось загрузить новые сообщения')
    }
  }

  return {
    chatInfo,
    groupedByDateMessages,
    earliestMessageId,
    latestMessageId,
  }
}

function formatAndPrependMessages(
  currentArray: ISupportChatMessagesDateGroup[],
  messages: ISupportChatMessage[]
) {
  const arr: ISupportChatMessagesDateGroup[] = [...currentArray]

  for (let message of messages.reverse()) {
    let firstDateGroup: ISupportChatMessagesDateGroup | undefined = arr.at(0)
    if (
      !firstDateGroup ||
      !checkSameDate(firstDateGroup.date, message.created_at)
    ) {
      firstDateGroup = { date: message.created_at, groups: [] }
      arr.unshift(firstDateGroup)
    }

    let firstSenderGroup: ISupportChatMessageSenderGroup | undefined =
      firstDateGroup.groups.at(0)
    if (
      !firstSenderGroup ||
      firstSenderGroup.sender_type !== message.sender_type
    ) {
      firstSenderGroup = { sender_type: message.sender_type, messages: [] }
      firstDateGroup.groups.unshift(firstSenderGroup)
    }

    firstSenderGroup.messages.unshift(message)
  }

  return arr
}

function formatAndAppendMessages(
  currentArray: ISupportChatMessagesDateGroup[],
  messages: ISupportChatMessage[]
) {
  const arr: ISupportChatMessagesDateGroup[] = [...currentArray]

  for (let message of messages) {
    let lastDateGroup: ISupportChatMessagesDateGroup | undefined = arr.at(
      arr.length - 1
    )
    if (
      !lastDateGroup ||
      !checkSameDate(lastDateGroup.date, message.created_at)
    ) {
      lastDateGroup = { date: message.created_at, groups: [] }
      arr.push(lastDateGroup)
    }

    let lastSenderGroup: ISupportChatMessageSenderGroup | undefined =
      lastDateGroup.groups.at(lastDateGroup.groups.length - 1)
    if (
      !lastSenderGroup ||
      lastSenderGroup.sender_type !== message.sender_type
    ) {
      lastSenderGroup = { sender_type: message.sender_type, messages: [] }
      lastDateGroup.groups.push(lastSenderGroup)
    }

    lastSenderGroup.messages.push(message)
  }

  return arr
}

function checkSameDate(dateFirstStr: string, dateSecondStr: string) {
  const dateFirst = new Date(dateFirstStr)
  const dateSecond = new Date(dateSecondStr)

  const isSameDay = dateFirst.getDate() === dateSecond.getDate()
  const isSameMonth = dateFirst.getMonth() === dateSecond.getMonth()
  const isSameYear = dateFirst.getFullYear() === dateSecond.getFullYear()
  return isSameDay && isSameMonth && isSameYear
}
