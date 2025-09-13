import type IPagination from '~/dataAccess/api/IPagination'
import type { ISupportChatMessage } from '~/domain/chats/support-chat/interfaces/ISupportChatMessage'

export function useSupportChat(
  spyElement: Ref<HTMLElement | null>,
  chatBodyElement: Ref<HTMLElement | null>
) {
  const { $afFetch } = useNuxtApp()

  const page = ref(1)

  const newMessage = ref('')

  const sending = ref(false)
  const isMounted = ref(false)
  const formattedList = ref<
    { date: string; groups: ISupportChatMessage[][] }[]
  >([])

  const wasScrolledRecently = ref(false)
  let wasScrolledRecentlyTimeout: ReturnType<typeof setTimeout>

  const {
    data: paginationData,
    execute: _loadNextPage,
    status,
  } = useAPI<IPagination<ISupportChatMessage[]>>('support-chat/user/history', {
    credentials: 'include',
    query: {
      page,
    },
    immediate: false,
    watch: false,
    onResponse({ response }) {
      const messages = response._data?.data as ISupportChatMessage[]

      if (response.ok && messages) {
        messages.forEach((message) => _prependMessage(message))
        const lastPage = paginationData.value?.last_page
        if (!lastPage || page.value <= lastPage) page.value += 1
      }
    },
  })

  let spyObserver: IntersectionObserver

  onMounted(async () => {
    await _loadMore()

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
    if (status.value === 'pending') return

    await _loadNextPage()
  }

  function _prependMessage(message: ISupportChatMessage) {
    const messageDateDotted = _getDottedDate(message.created_at)
    const lastFormattedDateDotted = formattedList.value.at(0)?.date

    if (
      messageDateDotted !== lastFormattedDateDotted ||
      !lastFormattedDateDotted
    )
      formattedList.value.unshift({ date: messageDateDotted, groups: [] })

    const groups = formattedList.value[0].groups
    let lastGroup = groups[0]
    if (!lastGroup) {
      lastGroup = []
      groups.unshift(lastGroup)
    }
    const lastMessage = lastGroup[0]
    if (lastMessage && lastMessage.by_user !== message.by_user)
      groups.unshift([message])
    else lastGroup.unshift(message)
  }

  function _appendMessage(message: ISupportChatMessage) {
    const messageDateDotted = _getDottedDate(message.created_at)
    const lastFormattedDateDotted = formattedList.value.at(
      formattedList.value.length - 1
    )?.date

    if (
      messageDateDotted !== lastFormattedDateDotted ||
      !lastFormattedDateDotted
    )
      formattedList.value.push({ date: messageDateDotted, groups: [] })

    const groups = formattedList.value[formattedList.value.length - 1].groups
    let lastGroup = groups[groups.length - 1]
    if (!lastGroup) {
      lastGroup = []
      groups.push(lastGroup)
    }
    const lastMessage = lastGroup[lastGroup.length - 1]
    if (lastMessage && lastMessage.by_user !== message.by_user)
      groups.push([message])
    else lastGroup.push(message)
  }

  function _getDottedDate(date: string) {
    const messageDate = new Date(date)
    return `${
      messageDate.getMonth() + 1
    }.${messageDate.getDate()}.${messageDate.getFullYear()}`
  }

  async function send() {
    sending.value = true

    await $afFetch('support-chat/user/message', {
      method: 'POST',
      credentials: 'include',
      body: {
        message: newMessage.value,
      },
      async onResponse({ response }) {
        const message = response._data.data.message as ISupportChatMessage
        if (response.ok && message) {
          newMessage.value = ''
          _appendMessage(message)

          await nextTick()
          _scrollChatBodyToBottom()
        }
      },
    })

    sending.value = false
  }

  function onChatBodyScroll() {
    wasScrolledRecently.value = true
    if (wasScrolledRecentlyTimeout) clearTimeout(wasScrolledRecentlyTimeout)

    wasScrolledRecentlyTimeout = setTimeout(() => {
      wasScrolledRecently.value = false
    }, 1500)
  }

  return {
    sending,
    isMounted,
    formattedList,
    wasScrolledRecently,
    newMessage,
    send,
    onChatBodyScroll,
    status,
  }
}
