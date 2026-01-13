import type { ShallowRef } from 'vue'
import { useSupportChatLoading } from '~/domain/support/chat/composeables/useSupportChatLoading'
import { useSupportChatStore } from '~/stores/supportChat/useSupportChatStore'

const _OBSERVER_MARGIN_ = 100

export function useSupportChatUi(
  chatBodyElement: ShallowRef<HTMLElement | null>,
  topSpyElement: ShallowRef<HTMLElement | null>,
  bottomSpyElement: ShallowRef<HTMLElement | null>,
  chat_id?: MaybeRefOrGetter<number>
) {
  const store = useSupportChatStore(chat_id)
  const {
    savedScrollPosition,
    chatInfo,
    allEarlierMessagesLoaded,
    allLaterMessagesLoaded,
  } = storeToRefs(store)

  const { loadMoreEarlier, loadMoreLater } = useSupportChatLoading(chat_id)

  const { fn: onChatBodyScroll, cancel: cancelChatBodyScrollHandler } =
    debounce(() => {
      if (chatBodyElement.value)
        savedScrollPosition.value = chatBodyElement.value.scrollTop
    }, 500)

  onMounted(async () => {
    chatBodyElement.value?.addEventListener('scroll', onChatBodyScroll)

    await nextTick()

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

  onUnmounted(() => {
    cancelChatBodyScrollHandler()
    console.log(savedScrollPosition.value, 'on leave');
    if (topSpyObserver) topSpyObserver.disconnect()
    if (bottomSpyObserver) bottomSpyObserver.disconnect()
    chatBodyElement.value?.removeEventListener('scroll', onChatBodyScroll)
  })

  let topSpyObserver: IntersectionObserver
  let bottomSpyObserver: IntersectionObserver
  const initTopObserver = () => {
    if (topSpyElement.value && chatBodyElement.value) {
      topSpyObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {
          if (entries.find((entry) => entry.isIntersecting)) loadMoreTop()
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
          if (entries.find((entry) => entry.isIntersecting)) loadMoreBottom()
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

  async function loadMoreTop() {
    if (allEarlierMessagesLoaded.value) return

    const heightBefore = chatBodyElement.value?.scrollHeight ?? 0

    await loadMoreEarlier()
    compensateHeight(heightBefore)
  }
  async function loadMoreBottom(load_all?: boolean) {
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

  return {
    loadMoreTop,
    loadMoreBottom,
  }
}
