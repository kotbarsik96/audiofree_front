import type IPagination from '~/dataAccess/api/IPagination'
import type { ISupportChatMessage } from './interfaces/ISupportChatMessage'

export function useSupportChat(
  spyElement: Ref<HTMLElement | null>,
  chatGroupsElement: Ref<HTMLElement | null>
) {
  const { $afFetch } = useNuxtApp()

  const page = ref(1)

  const sending = ref(false)
  const isMounted = ref(false)
  const formattedList = ref<
    { date: string; groups: ISupportChatMessage[][] }[]
  >([])

  const { execute: _loadMore } = useAPI<IPagination<ISupportChatMessage[]>>(
    'support-chat/user/history',
    {
      credentials: 'include',
      query: {
        page,
      },
      onResponse({ response }) {
        if (response.ok && response._data?.data) {
          _formatAndPrependResponseMessages(response._data?.data.data)
          page.value += 1
        }
      },
    }
  )

  let spyObserver: IntersectionObserver

  onMounted(async () => {
    _initChatGroupsElement()
    _initSpy()
    await nextTick()

    chatGroupsElement.value?.scrollTo({
      top:
        chatGroupsElement.value?.scrollHeight -
        chatGroupsElement.value?.offsetHeight,
    })

    isMounted.value = true
  })

  onUnmounted(() => {
    if (spyObserver) spyObserver.disconnect()
  })

  function _initChatGroupsElement() {
    chatGroupsElement.value?.scrollTo({
      top:
        chatGroupsElement.value?.scrollHeight -
        chatGroupsElement.value?.offsetHeight,
    })
  }

  function _initSpy() {
    if (spyElement.value) {
      spyObserver = new IntersectionObserver(_intersectionCallback)
      spyObserver.observe(spyElement.value)
    }
  }

  function _intersectionCallback() {
    _loadMore()
  }

  function _formatAndPrependResponseMessages(messages: ISupportChatMessage[]) {
    messages.forEach((message) => {
      const messageDate = new Date(message.created_at)
      const messageDateDotted = `${
        messageDate.getMonth() + 1
      }.${messageDate.getDate()}.${messageDate.getFullYear()}`
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
    })
  }

  async function send(message: string) {
    sending.value = true

    await $afFetch('support-chat/user/message', {
      method: 'POST',
      credentials: 'include',
      body: {
        message,
      },
    })

    sending.value = false
  }

  return {
    sending,
    isMounted,
    formattedList,
    send,
  }
}
