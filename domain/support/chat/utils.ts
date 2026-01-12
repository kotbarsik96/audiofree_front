import { toValue, type ShallowRef } from 'vue'
import type { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'

export function prependSupportChatMessages(
  currentMessages: ShallowRef<ISupportChatMessage[]>,
  newMessages: ISupportChatMessage[],
  chatInfo: ISupportChatInfo | undefined
) {
  if (newMessages.length > 0 && chatInfo) {
    currentMessages.value = [
      ...newMessages.filter((msg) => msg.chat_id === chatInfo.chat_id),
      ...currentMessages.value,
    ]
  }
}

export function appendSupportChatMessages(
  currentMessages: ShallowRef<ISupportChatMessage[]>,
  newMessages: ISupportChatMessage[],
  chatInfo: ISupportChatInfo | undefined
) {
  if (newMessages.length > 0 && chatInfo) {
    currentMessages.value = [
      ...currentMessages.value,
      ...newMessages.filter((msg) => msg.chat_id === chatInfo.chat_id),
    ]
  }
}

export function groupMessages(
  messages: ShallowRef<ISupportChatMessage[]>,
  chatInfo: MaybeRefOrGetter<ISupportChatInfo | undefined>
) {
  const arr: ISupportChatMessagesDateGroup[] = []

  const chatInfoValue = toValue(chatInfo)

  if (chatInfoValue) {
    messages.value
      .filter((msg) => msg.chat_id === chatInfoValue.chat_id)
      .forEach((message) => {
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
          lastSenderGroup = {
            sender_type: message.sender_type as ESupportChatSenderType,
            messages: [],
          }
          lastDateGroup.groups.push(lastSenderGroup)
        }

        lastSenderGroup.messages.push(message)
      })
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

/** @param readMessagesIds - список id сообщений, которым выставляется "прочитано". Если список не передан - отметка выставляется всем сообщениям в messages */
export function setReadAtToMessages(
  messages: Ref<ISupportChatMessage[]>,
  readMessagesIds?: number[]
) {
  messages.value = messages.value.map((msg) => {
    if (!readMessagesIds || readMessagesIds.includes(msg.id)) {
      msg.read_at = new Date().toLocaleString()
    }
    return msg
  })
}
