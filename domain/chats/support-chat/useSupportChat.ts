import type { ISupportChat } from '~/domain/chats/support-chat/interfaces/ISupportChat'

export function useSupportChat(
  spyElement: Ref<HTMLElement | null>,
  chatBodyElement: Ref<HTMLElement | null>,
  supportChat: ISupportChat
) {
  const inputDisabled = ref(false)
  const isMounted = ref(false)

  const wasScrolledRecently = ref(false)
  let wasScrolledRecentlyTimeout: ReturnType<typeof setTimeout>

  const { paginationData, loadHistory, loadHistoryStatus, page, sendMessage } =
    supportChat

  let spyObserver: IntersectionObserver

  onMounted(async () => {
    _scrollChatBodyToBottom()
    isMounted.value = true
    await nextTick()
    _scrollChatBodyToBottom()
    _initSpy()
  })

  onUnmounted(() => {
    if (spyObserver) spyObserver.disconnect()
  })

  function _scrollChatBodyToBottom() {
    chatBodyElement.value?.scrollTo({
      top:
        chatBodyElement.value?.scrollHeight -
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

    await loadHistory()
  }

  async function send() {
    inputDisabled.value = true

    try {
      const sent = await sendMessage()
      if (sent) {
        await nextTick()
        _scrollChatBodyToBottom()
      }
    } catch (e) {}

    inputDisabled.value = false
  }

  function onChatBodyScroll() {
    wasScrolledRecently.value = true
    if (wasScrolledRecentlyTimeout) clearTimeout(wasScrolledRecentlyTimeout)

    wasScrolledRecentlyTimeout = setTimeout(() => {
      wasScrolledRecently.value = false
    }, 1500)
  }

  return {
    inputDisabled,
    isMounted,
    wasScrolledRecently,
    send,
    onChatBodyScroll,
    loadHistoryStatus,
  }
}
