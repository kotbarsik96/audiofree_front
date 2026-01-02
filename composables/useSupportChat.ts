import { createError } from 'nuxt/app'
import { storeToRefs } from 'pinia'
import type { ShallowRef } from 'vue'
import { useAPI } from '~/composables/useAPI'
import { useNotifications } from '~/composables/useNotifications'
import { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import type { ISupportChatChangedInfoEvent } from '~/domain/support/chat/interfaces/ISupportChatChangedInfoEvent'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'
import type { ISupportChatMessageCreatedEvent } from '~/domain/support/chat/interfaces/ISupportChatMessageCreatedEvent'
import type { ISupportChatMessagesList } from '~/domain/support/chat/interfaces/ISupportChatMessagesList'
import type { ISupportChatReadMessagesEvent } from '~/domain/support/chat/interfaces/ISupportChatReadMessagesEvent'
import type { ISupportChatWriteStatusChangeEvent } from '~/domain/support/chat/interfaces/ISupportChatWriteStatusChangeEvent'
import {
  formatAndAppendMessages,
  formatAndPrependMessages,
  setReadAtToMessages,
} from '~/domain/support/chat/utils'
import type IUser from '~/domain/user/types/IUser'
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
  const user = useSanctumUser<IUser>()

  const echo = useEcho()
  const channelName = chat_id
    ? `support-chat-staff.${toValue(chat_id)}`
    : `support-chat-user.${user.value?.id}`
  const echoSubscribe = () => {
    if (!chatInfo.value) {
      console.warn('Chat was not found')
      return
    }

    echo
      .private(channelName)
      // новые сообщения (как от собеседника, так и от себя)
      .listen(
        '.support-chat-message-created',
        (data: ISupportChatMessageCreatedEvent) => {
          // обновлять список сообщений только при получении от собеседника/других сотрудников
          console.log(data)
          if (
            data.message.author_id !== user.value?.id ||
            data.message.sender_type === 'system'
          ) {
            messagesGroupedByDate.value = formatAndAppendMessages(
              messagesGroupedByDate.value,
              [data.message],
              chatInfo,
              latestMessageId
            )
          }

          updateChatInfo(data.chat_info)
        }
      )
      // собеседник прочитал сообщения
      .listen('.support-chat-read', (data: ISupportChatReadMessagesEvent) => {
        if (data.reader_id !== user.value?.id)
          setReadAtToMessages(
            messagesGroupedByDate.value,
            data.read_messages_ids
          )
      })
      // собеседник начал/прекратил печатать
      .listen(
        '.support-chat-write-status',
        (data: ISupportChatWriteStatusChangeEvent) => {
          updateChatInfo(data.chat_info)
        }
      )
      // был обновлён чат
      .listen(
        '.support-chat-changed-info',
        (data: ISupportChatChangedInfoEvent) => {
          updateChatInfo(data.chat_info)
        }
      )
      .error((err: any) => console.error(err))
  }
  const echoLeave = () => {
    echo.leave(channelName)
  }

  const { addNotification } = useNotifications()

  const onChatBodyScroll = debounce(() => {
    if (chatBodyElement.value)
      savedScrollPosition.value = chatBodyElement.value.scrollTop
  }, 500)

  onMounted(() => {
    echoSubscribe()

    nextTick().then(() => {
      const totalMessages = chatInfo.value?.total_messages ?? 0
      const unreadMessages = chatInfo.value?.unread_messages ?? 0

      if (savedScrollPosition.value) {
        chatBodyElement.value?.scrollTo({ top: savedScrollPosition.value })
      } else if (unreadMessages === 0) {
        chatBodyElement.value?.scrollTo({
          top: chatBodyElement.value.scrollHeight,
        })
      } else if (totalMessages - unreadMessages > 3) {
        chatBodyElement.value?.scrollTo({ top: _OBSERVER_MARGIN_ * 2 })
      }

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

  const store = chat_id ? useSupportChatStaffStore() : useSupportChatUserStore()
  const { updateChatInfo } = store
  const storeRefs = storeToRefs(store)
  const {
    messagesGroupedByDate,
    earliestMessageId,
    latestMessageId,
    chatInfo,
    savedScrollPosition,
    isFirstLoading,
  } = storeRefs

  const { loadMoreEarlier, loadMoreLater } = useSupportChatLoading(
    earliestMessageId,
    latestMessageId,
    messagesGroupedByDate,
    chatInfo,
    chat_id
  )

  const allEarlierMessagesLoaded = computed(
    () =>
      earliestMessageId.value &&
      earliestMessageId.value <= (chatInfo.value?.first_message_id ?? 0)
  )
  const allLaterMessagesLoaded = computed(() => {
    return (
      latestMessageId.value &&
      latestMessageId.value >= (chatInfo.value?.last_message_id ?? 0)
    )
  })

  const currentSenderType = computed(() =>
    chat_id ? ESupportChatSenderType.Staff : ESupportChatSenderType.User
  )
  const companionSenderType = computed(() =>
    chat_id ? ESupportChatSenderType.User : ESupportChatSenderType.Staff
  )

  // достать чат из кэша, если есть
  if ('changeChat' in store && chat_id) {
    store.changeChat(toValue(chat_id))
  }
  // если чата в кэше по данному id нет - загрузить
  if (!chatInfo.value) {
    await _loadFirst()
  }

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
  watch(
    () => chatInfo.value?.chat_id,
    () => {
      if (topSpyObserver) topSpyObserver.disconnect()
      if (bottomSpyObserver) bottomSpyObserver.disconnect()
    },
    {
      once: true,
    }
  )

  async function _loadFirst() {
    isFirstLoading.value = true

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

    if (chatInfoError.value && chatInfoError.value.statusCode !== 404) {
      isFirstLoading.value = false
      throw createError(chatInfoError.value)
    }

    if (
      chat_id &&
      chatInfoError.value?.statusCode === 404 &&
      typeof window !== 'undefined'
    ) {
      addNotification('error', chatInfoError.value.data.message, 30000)
    }

    chatInfo.value = chatInfoData.value?.data
    messagesGroupedByDate.value = formatAndAppendMessages(
      messagesGroupedByDate.value,
      messagesData.value?.data.messages ?? [],
      chatInfo,
      latestMessageId
    )
    earliestMessageId.value = messagesData.value?.data.earliest_loaded_id

    isFirstLoading.value = false
  }

  async function _loadMoreTop() {
    if (allEarlierMessagesLoaded.value) return

    const heightBefore = chatBodyElement.value?.scrollHeight ?? 0

    await loadMoreEarlier()
    compensateHeight(heightBefore)
  }
  async function _loadMoreBottom(load_all?: boolean) {
    if (allLaterMessagesLoaded.value) return

    await loadMoreLater(load_all)
  }

  async function compensateHeight(heightBefore: number) {
    await nextTick()

    const heightAfter = chatBodyElement.value?.scrollHeight ?? 0
    const diff = heightAfter - heightBefore

    chatBodyElement.value?.scrollTo({
      top: chatBodyElement.value.scrollTop + diff,
    })
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
    allEarlierMessagesLoaded,
    allLaterMessagesLoaded,
  }
}

export function useSupportChatLoading(
  earliestMessageId: Ref<number | undefined>,
  latestMessageId: Ref<number | undefined>,
  messagesGroupedByDate: Ref<ISupportChatMessagesDateGroup[]>,
  chatInfo: MaybeRefOrGetter<ISupportChatInfo | undefined>,
  chatId?: MaybeRefOrGetter<number | undefined>
) {
  const { addNotification } = useNotifications()
  const { $afFetch } = useNuxtApp()

  async function loadMoreEarlier() {
    try {
      await $afFetch('/support-chat/messages', {
        query: {
          earliest_message_id: earliestMessageId.value,
          chat_id: toValue(chatId),
        },
        credentials: 'include',
        onResponse({ response }) {
          const { messages: loadedMessages, earliest_loaded_id } =
            response._data.data

          earliestMessageId.value = earliest_loaded_id
          messagesGroupedByDate.value = formatAndPrependMessages(
            messagesGroupedByDate.value,
            loadedMessages,
            chatInfo,
            earliestMessageId
          )
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
          chat_id: toValue(chatId),
          load_all,
        },
        credentials: 'include',
        onResponse({ response }) {
          const { messages: loadedMessages, latest_loaded_id } =
            response._data.data

          messagesGroupedByDate.value = formatAndAppendMessages(
            messagesGroupedByDate.value,
            loadedMessages,
            chatInfo,
            latestMessageId
          )
        },
      })
    } catch (err) {
      addNotification('error', 'Не удалось загрузить новые сообщения')
    }
  }

  return { loadMoreEarlier, loadMoreLater }
}

export function useSupportChatBottomButton(
  chatBodyElement: Readonly<ShallowRef<HTMLElement | null>>
) {
  const isBtnVisible = ref(false)

  const onChatBodyScroll = debounce(() => {
    if (chatBodyElement.value) {
      const chatBodyHeight = chatBodyElement.value.offsetHeight
      const pos = chatBodyElement.value.scrollTop + chatBodyHeight
      isBtnVisible.value = pos <= chatBodyElement.value.scrollHeight - 50
    }
  }, 100)

  const onChatBottomBtnClick = () => {
    isBtnVisible.value = false
    chatBodyElement.value?.scrollTo({
      top: chatBodyElement.value.scrollHeight,
      behavior: 'smooth',
    })
  }

  return {
    isBtnVisible,
    onChatBodyScroll,
    onChatBottomBtnClick,
  }
}
