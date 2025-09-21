import type IPagination from '~/dataAccess/api/IPagination'
import type { AsyncDataRequestStatus } from '#app'
import type { ISupportChatMessage } from '~/domain/chats/support-chat/interfaces/ISupportChatMessage'

export function useSupportChat(
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

    await loadHistory()
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
