import type IPagination from '~/dataAccess/api/IPagination'
import type { AsyncDataRequestStatus } from '#app'
import type { ISupportChatMessage } from '~/domain/chats/support-chat/interfaces/ISupportChatMessage'
import type { SupportChat } from '~/domain/chats/support-chat/SupportChat'
import type { IChatInfo } from './interfaces/IChatInfo'

export function useSupportChat(
  spyTopElement: Ref<HTMLElement | null>,
  spyBottomElement: Ref<HTMLElement | null>,
  chatBodyElement: Ref<HTMLElement | null>,
  initialLoadPage: number,
  initialLoadLastPage: number,
  supportChat: SupportChat,
  chatInfo: ComputedRef<IChatInfo | undefined>,
  loadHistoryUrl: string
) {
  const { $afFetch } = useNuxtApp()
  const { addNotification } = useNotifications()
  const echo = useEcho()

  const lastPage = ref(initialLoadLastPage)
  const isLoadingTop = ref(false)
  const isLoadingBottom = ref(false)
  const pageTop = ref<number>(initialLoadPage + 1)
  const pageBottom = ref<number>(initialLoadPage - 1)

  const isMounted = ref(false)

  const wasScrolledRecently = ref(false)
  let _wasScrolledRecentlyTimeout: ReturnType<typeof setTimeout>

  const readMessages = ref<number[]>([])
  const sendReadMessagesDebounced = debounce(async () => {
    console.log(readMessages.value);
    await $afFetch('support-chat/read', {
      method: 'POST',
      credentials: 'include',
      body: {
        chat_id: chatInfo.value?.chat_id,
        first_message_id: readMessages.value.at(0),
        read_count: readMessages.value.length,
      },
    })
  }, 1000)

  watch(readMessages, sendReadMessagesDebounced)

  let _spyTopObserver: IntersectionObserver
  let _spyBottomObserver: IntersectionObserver

  onMounted(() => {
    _initEcho()
    _initSpyTop()
    _initSpyBottom()
    _scrollChatBodyOnMount()
    isMounted.value = true
  })

  onUnmounted(() => {
    _leaveEcho()
    if (_spyTopObserver) _spyTopObserver.disconnect()
    if (_spyBottomObserver) _spyTopObserver.disconnect()
  })

  function _initEcho() {
    if (chatInfo.value) {
      echo
        .private(`support.message.${chatInfo.value.chat_id}`)
        .listen('.support-message', (message: ISupportChatMessage) => {
          supportChat.appendMessage(message)
        })
        .listen('.support-read-message', (messagesIds: number[]) => {
          supportChat.readMessages(messagesIds)
        })
    } else {
      throw new Error('No chat info provided')
    }
  }

  function _leaveEcho() {
    if (chatInfo.value) echo.leave(`support.message.${chatInfo.value.chat_id}`)
  }

  function _initSpyTop() {
    if (spyTopElement.value) {
      _spyTopObserver = new IntersectionObserver((entries) => {
        if (entries.find((entry) => entry.isIntersecting)) _loadMoreTop()
      })
      _spyTopObserver.observe(spyTopElement.value)
    }
  }

  function _initSpyBottom() {
    if (spyBottomElement.value) {
      _spyBottomObserver = new IntersectionObserver((entries) => {
        if (entries.find((entry) => entry.isIntersecting)) _loadMoreBottom()
      })
      _spyBottomObserver.observe(spyBottomElement.value)
    }
  }

  async function _loadMoreTop() {
    if (isLoadingTop.value || pageTop.value > lastPage.value || !chatInfo.value)
      return

    isLoadingTop.value = true

    try {
      await $afFetch(loadHistoryUrl, {
        credentials: 'include',
        query: {
          page: pageTop.value,
          chat_id: chatInfo.value?.chat_id,
        },
        onResponse({ response }) {
          // запомнить высоту чата до новых сообщений
          const chatHeightBeforePrepend =
            chatBodyElement.value?.scrollHeight || 0

          const messages = response._data?.data as ISupportChatMessage[]

          if (response.ok && messages) {
            messages.forEach((message) => supportChat.prependMessage(message))

            // компенсировать изменение высоты
            if (chatHeightBeforePrepend)
              chatBodyElement.value?.scrollTo({
                behavior: 'instant',
                top:
                  chatBodyElement.value.scrollTop +
                  (chatBodyElement.value.scrollHeight -
                    chatHeightBeforePrepend),
              })

            pageTop.value = response._data.current_page + 1
            lastPage.value = response._data.last_page
          }
        },
        onResponseError() {
          addNotification('error', 'Не удалось загрузить предыдущие сообщения')
        },
      })
    } catch (e) {
      console.error(e)
    }

    isLoadingTop.value = false
  }

  async function _loadMoreBottom() {
    if (isLoadingBottom.value || pageBottom.value < 1 || !chatInfo.value) return

    isLoadingBottom.value = true

    try {
      await $afFetch(loadHistoryUrl, {
        credentials: 'include',
        query: {
          page: pageBottom.value,
          chat_id: chatInfo.value?.chat_id,
        },
        onResponse({ response }) {
          const messages = response._data?.data as ISupportChatMessage[]

          if (response.ok && messages) {
            messages
              .reverse()
              .forEach((message) => supportChat.appendMessage(message))

            pageBottom.value = response._data.current_page - 1
            lastPage.value = response._data.last_page
          }
        },
        onResponseError() {
          addNotification('error', 'Не удалось загрузить новые сообщения')
        },
      })
    } catch (e) {
      console.error(e)
    }

    isLoadingBottom.value = false
  }

  function _scrollChatBodyOnMount() {
    if (initialLoadPage === 1) scrollChatBodyToBottom()
    else {
      chatBodyElement.value?.scrollTo({
        top: chatBodyElement.value.scrollHeight,
      })
    }
  }

  function onChatBodyScroll() {
    wasScrolledRecently.value = true
    if (_wasScrolledRecentlyTimeout) clearTimeout(_wasScrolledRecentlyTimeout)

    _wasScrolledRecentlyTimeout = setTimeout(() => {
      wasScrolledRecently.value = false
    }, 1500)
  }

  function scrollChatBodyToBottom() {
    chatBodyElement.value?.scrollTo({
      top:
        chatBodyElement.value?.scrollHeight +
        chatBodyElement.value?.offsetHeight,
    })
  }

  return {
    pageTop,
    pageBottom,
    isMounted,
    wasScrolledRecently,
    isLoadingTop,
    isLoadingBottom,
    onChatBodyScroll,
    scrollChatBodyToBottom,
    readMessages,
  }
}

export function old_useSupportChat(
  spyElement: Ref<HTMLElement | null>,
  chatBodyElement: Ref<HTMLElement | null>,
  page: Ref<number>,
  paginationData: Ref<IPagination<ISupportChatMessage> | null>,
  loadHistoryStatus: Ref<AsyncDataRequestStatus>,
  loadHistory: () => Promise<void>
) {
  const isMounted = ref(false)

  const wasScrolledRecently = ref(false)
  let wasScrolledRecentlyTimeout: ReturnType<typeof setTimeout>

  let spyObserver: IntersectionObserver

  onMounted(async () => {
    await nextTick()
    scrollChatBodyToBottom()

    await nextTick()
    _initSpy()
    isMounted.value = true

    page.value = 2
  })

  onUnmounted(() => {
    if (spyObserver) spyObserver.disconnect()
  })

  function scrollChatBodyToBottom() {
    chatBodyElement.value?.scrollTo({
      top:
        chatBodyElement.value?.scrollHeight +
        chatBodyElement.value?.offsetHeight,
    })
  }

  function _initSpy() {
    if (spyElement.value) {
      spyObserver = new IntersectionObserver(_intersectionCallback)
      spyObserver.observe(spyElement.value)
    }
  }

  function _intersectionCallback(entries: IntersectionObserverEntry[]) {
    if (entries.find((entry) => entry.isIntersecting)) _loadMore()
  }

  async function _loadMore() {
    const lastPage = paginationData.value?.last_page
    if (lastPage && page.value > lastPage) return
    if (loadHistoryStatus.value === 'pending') return

    // запомнить высоту чата до загрузки новых данных
    const chatHeightBeforeLoad = chatBodyElement.value?.scrollHeight || 0

    await loadHistory()
    page.value += 1

    // компенсировать изменение высоты
    if (chatHeightBeforeLoad)
      chatBodyElement.value?.scrollTo({
        behavior: 'instant',
        top:
          chatBodyElement.value.scrollTop +
          (chatBodyElement.value.scrollHeight - chatHeightBeforeLoad),
      })
  }

  function onChatBodyScroll() {
    wasScrolledRecently.value = true
    if (wasScrolledRecentlyTimeout) clearTimeout(wasScrolledRecentlyTimeout)

    wasScrolledRecentlyTimeout = setTimeout(() => {
      wasScrolledRecently.value = false
    }, 1500)
  }

  return {
    isMounted,
    wasScrolledRecently,
    onChatBodyScroll,
    scrollChatBodyToBottom,
  }
}
