import type { ShallowRef } from 'vue'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'
import type { ISupportChatMessagesList } from '~/domain/support/chat/interfaces/ISupportChatMessagesList'

export interface ISupportChatMessagesDate {
  date: string
}

export type TFormattedMessages = (
  | ISupportChatMessage
  | ISupportChatMessagesDate
)[]

export async function useSupportChat(
  topSpy: ShallowRef<HTMLElement | null>,
  bottomSpy: ShallowRef<HTMLElement | null>,
  chat_id?: MaybeRefOrGetter<number>
) {
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
    formatMessages(messagesData.value?.data.messages ?? [])
  )
  const earliestMessageId = ref(messagesData.value?.data.earliest_loaded_id)
  const latestMessageId = ref(messagesData.value?.data.latest_loaded_id)

  let topSpyObserver: IntersectionObserver
  let bottomSpyObserver: IntersectionObserver
  const initTopObserver = () => {
    if (topSpy.value) {
      topSpyObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {},
        {}
      )
    }
  }
  const initBottomObserver = () => {
    if (bottomSpy.value) {
      bottomSpyObserver = new IntersectionObserver(
        (entries: IntersectionObserverEntry[]) => {},
        {}
      )
    }
  }

  onMounted(() => {
    initTopObserver()
    initBottomObserver()
  })

  onUnmounted(() => {
    if (topSpyObserver) topSpyObserver.disconnect()
    if (bottomSpyObserver) bottomSpyObserver.disconnect()
  })

  return {
    chatInfo,
    messages,
    earliestMessageId,
    latestMessageId,
  }
}

function formatMessages(messages: ISupportChatMessage[]) {
  let arr: TFormattedMessages = []

  messages.forEach((msg) => {
    const lastArrayDate = arr.findLast((item) => 'date' in item)
    if (lastArrayDate) {
      const lastDate = new Date(lastArrayDate.date)
      const msgDate = new Date(msg.created_at)
      const isSameDate = checkSameDate(lastDate, msgDate)

      if (!isSameDate) arr.push({ date: msg.created_at })
    } else arr.push({ date: msg.created_at })

    arr.push(msg)
  })

  return arr
}

function checkSameDate(dateFirst: Date, dateSecond: Date) {
  const isSameDay = dateFirst.getDate() === dateSecond.getDate()
  const isSameMonth = dateFirst.getMonth() === dateSecond.getMonth()
  const isSameYear = dateFirst.getFullYear() === dateSecond.getFullYear()
  return isSameDay && isSameMonth && isSameYear
}
