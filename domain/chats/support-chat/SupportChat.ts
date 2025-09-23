import type { IFormattedSupportChatMessage } from '~/domain/chats/support-chat/interfaces/IFormattedSupportChatMessage'
import type { ISupportChatMessage } from '~/domain/chats/support-chat/interfaces/ISupportChatMessage'

export class SupportChat {
  public formattedMessages: Ref<IFormattedSupportChatMessage[]> = useState(
    'formattedChatMessages',
    () => []
  )

  public prependMessage(message: ISupportChatMessage) {
    const messageDateDotted = this.getDottedDate(message.created_at)
    const lastFormattedDateDotted = this.formattedMessages.value.at(0)?.date

    if (
      messageDateDotted !== lastFormattedDateDotted ||
      !lastFormattedDateDotted
    )
      this.formattedMessages.value.unshift({
        date: messageDateDotted,
        groups: [],
      })

    const groups = this.formattedMessages.value[0].groups
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

  public appendMessage(message: ISupportChatMessage) {
    const messageDateDotted = this.getDottedDate(message.created_at)
    const lastFormattedDateDotted = this.formattedMessages.value.at(
      this.formattedMessages.value.length - 1
    )?.date

    if (
      messageDateDotted !== lastFormattedDateDotted ||
      !lastFormattedDateDotted
    )
      this.formattedMessages.value.push({ date: messageDateDotted, groups: [] })

    const groups =
      this.formattedMessages.value[this.formattedMessages.value.length - 1]
        .groups
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

  public getDottedDate(date: string) {
    const messageDate = new Date(date)
    return `${
      messageDate.getMonth() + 1
    }.${messageDate.getDate()}.${messageDate.getFullYear()}`
  }

  public readMessages(messagesIds: number[]) {
    this.formattedMessages.value.forEach((fmsg) => {
      fmsg.groups.forEach((group) => {
        group.forEach((message) => {
          if (messagesIds.includes(message.id)) message.was_read = true
        })
      })
    })
  }
}
