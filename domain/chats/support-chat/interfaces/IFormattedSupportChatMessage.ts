import type { ISupportChatMessage } from "~/domain/chats/support-chat/interfaces/ISupportChatMessage"

export interface IFormattedSupportChatMessage {
  date: string
  groups: ISupportChatMessage[][]
}
