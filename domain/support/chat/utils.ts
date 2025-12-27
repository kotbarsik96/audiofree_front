import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'

export function formatAndPrependMessages(
  currentArray: ISupportChatMessagesDateGroup[],
  messages: ISupportChatMessage[],
  earliestMessageId: Ref<number | undefined>
) {
  const arr: ISupportChatMessagesDateGroup[] = [...currentArray]

  for (let message of [...messages].reverse()) {
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

  earliestMessageId.value = messages.at(0)?.id

  return arr
}

export function formatAndAppendMessages(
  currentArray: ISupportChatMessagesDateGroup[],
  messages: ISupportChatMessage[],
  latestMessageId: Ref<number | undefined>
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

  latestMessageId.value = messages.at(messages.length - 1)?.id

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
