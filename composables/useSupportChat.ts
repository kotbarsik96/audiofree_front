import { createError } from 'nuxt/app'
import { storeToRefs } from 'pinia'
import type { ShallowRef } from 'vue'
import { useAPI } from '~/composables/useAPI'
import type { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'
import type { ISupportChatMessagesList } from '~/domain/support/chat/interfaces/ISupportChatMessagesList'
import { useSupportChatStaffStore } from '~/stores/supportChat/supportChatStaffStore'
import { useSupportChatUserStore } from '~/stores/supportChat/supportChatUserStore'

export interface ISupportChatMessagesDateGroup {
  date: string
  groups: ISupportChatMessagesSenderGroup[]
}

export interface ISupportChatMessagesSenderGroup {
  sender_type: ESupportChatSenderType
  messages: ISupportChatMessage[]
}

export async function useSupportChat(
  chatBodyElement: ShallowRef<HTMLElement | null>,
  topSpyElement: ShallowRef<HTMLElement | null>,
  bottomSpyElement: ShallowRef<HTMLElement | null>,
  chat_id?: MaybeRefOrGetter<number>
) {
  const echo = useEcho()
  const channelName = chat_id
    ? `support-chat.${toValue(chat_id)}`
    : 'support-chat'
  const echoSubscribe = () => {
    if (!chatInfo.value) {
      console.warn('Chat was not found')
      return
    }

    echo
      .private(channelName)
      .listen(
        '.support-chat-message-created',
        ({ message }: { message: ISupportChatMessage }) => {
          formatAndAppendMessages(messagesGroupedByDate.value, [message])
        }
      )
      .listen(
        '.support-chat-read',
        ({ readMessagesIds }: { readMessagesIds: number[] }) => {
          setReadAtToMessages(messagesGroupedByDate.value, readMessagesIds)
        }
      )
      .error((err: any) => console.error(err))
  }
  const echoLeave = () => {
    echo.leave(channelName)
  }

  const onChatBodyScroll = debounce(() => {
    if (chatBodyElement.value)
      savedScrollPosition.value = chatBodyElement.value.scrollTop
  }, 500)

  onMounted(() => {
    echoSubscribe()

    nextTick().then(() => {
      const totalMessages = chatInfo.value?.total_messages ?? 0
      const unreadMessages = chatInfo.value?.unread_messages ?? 0

      if (savedScrollPosition.value)
        chatBodyElement.value?.scrollTo({ top: savedScrollPosition.value })
      else if (unreadMessages === 0)
        chatBodyElement.value?.scrollTo({
          top: chatBodyElement.value.scrollHeight,
        })
      else if (totalMessages - unreadMessages > 3)
        chatBodyElement.value?.scrollTo({ top: _OBSERVER_MARGIN_ * 2 })

      setTimeout(() => {
        initTopObserver()
        initBottomObserver()
      }, 1000)
    })

    chatBodyElement.value?.addEventListener('scroll', onChatBodyScroll)
  })

  onUnmounted(() => {
    echoLeave()
    if (topSpyObserver) topSpyObserver.disconnect()
    if (bottomSpyObserver) bottomSpyObserver.disconnect()
    chatBodyElement.value?.removeEventListener('scroll', onChatBodyScroll)
  })

  const _OBSERVER_MARGIN_ = 100

  const { addNotification } = useNotifications()

  const { $afFetch } = useNuxtApp()

  const store = chat_id ? useSupportChatStaffStore() : useSupportChatUserStore()
  const storeRefs = storeToRefs(store)
  const {
    messagesGroupedByDate,
    earliestMessageId,
    latestMessageId,
    chatInfo,
    savedScrollPosition,
  } = storeRefs

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

  // достать чат из кэша, если есть
  if ('changeChat' in store && chat_id) store.changeChat(toValue(chat_id))
  // если чата в кэше по данному id нет - загрузить
  if (!chatInfo.value) await _loadFirst()

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
          rootMargin: `${_OBSERVER_MARGIN_}px 0px 0px 0px`,
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
          rootMargin: `0px 0px ${_OBSERVER_MARGIN_}px 0px`,
        }
      )
      bottomSpyObserver.observe(bottomSpyElement.value)
    }
  }

  async function _loadFirst() {
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

    if (chatInfoError.value && chatInfoError.value.statusCode !== 404)
      throw createError(chatInfoError.value)

    messagesGroupedByDate.value = formatAndAppendMessages(
      messagesGroupedByDate.value,
      messagesData.value?.data.messages ?? []
    )
    earliestMessageId.value = messagesData.value?.data.earliest_loaded_id
    latestMessageId.value = messagesData.value?.data.latest_loaded_id
    chatInfo.value = chatInfoData.value?.data
  }

  async function _loadMoreTop() {
    if (!earliestMessageId.value || allEarlierMessagesLoaded.value) return

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
          messagesGroupedByDate.value = formatAndPrependMessages(
            messagesGroupedByDate.value,
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
  async function _loadMoreBottom(load_all?: boolean) {
    if (!latestMessageId.value || allLaterMessagesLoaded.value) return

    try {
      await $afFetch('/support-chat/messages', {
        query: {
          latest_message_id: latestMessageId.value,
          chat_id: toValue(chat_id),
          load_all,
        },
        credentials: 'include',
        onResponse({ response }) {
          const { messages: loadedMessages, latest_loaded_id } =
            response._data.data

          latestMessageId.value = latest_loaded_id
          messagesGroupedByDate.value = formatAndAppendMessages(
            messagesGroupedByDate.value,
            loadedMessages
          )
        },
      })
    } catch (err) {
      addNotification('error', 'Не удалось загрузить новые сообщения')
    }
  }

  async function onMessageWritten() {
    // если у пользователя ещё нет чата - он будет создан при первом написании сообщения, поэтому его нужно загрузить
    if (!chatInfo.value) {
      await _loadFirst()
      echoSubscribe()
    }

    // если загружены не все последние сообщения - дозагрузить и выставить всем текущим прочитанное состояние
    if (!allLaterMessagesLoaded.value) {
      setReadAtToMessages(messagesGroupedByDate.value)
      await _loadMoreBottom(true)
    }

    await nextTick()
    chatBodyElement.value?.scrollTo({ top: chatBodyElement.value.scrollHeight })
  }

  return {
    chatInfo,
    earliestMessageId,
    latestMessageId,
    onMessageWritten,
  }
}

export function formatAndPrependMessages(
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

    let firstSenderGroup: ISupportChatMessagesSenderGroup | undefined =
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

export function formatAndAppendMessages(
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

    let lastSenderGroup: ISupportChatMessagesSenderGroup | undefined =
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

export function checkSameDate(dateFirstStr: string, dateSecondStr: string) {
  const dateFirst = new Date(dateFirstStr)
  const dateSecond = new Date(dateSecondStr)

  const isSameDay = dateFirst.getDate() === dateSecond.getDate()
  const isSameMonth = dateFirst.getMonth() === dateSecond.getMonth()
  const isSameYear = dateFirst.getFullYear() === dateSecond.getFullYear()
  return isSameDay && isSameMonth && isSameYear
}

export function getChatBodyElement(element: HTMLElement | null) {
  return element?.closest('.chat-body')
}

export function setReadAtToMessages(
  messagesGroupedByDate: ISupportChatMessagesDateGroup[],
  readMessagesIds?: number[]
) {
  messagesGroupedByDate.forEach((datedGroup) => {
    datedGroup.groups.forEach((item) => {
      item.messages.forEach((msg) => {
        if (!readMessagesIds || readMessagesIds.includes(msg.id)) {
          msg.read_at = new Date().toLocaleString()
        }
      })
    })
  })
}
