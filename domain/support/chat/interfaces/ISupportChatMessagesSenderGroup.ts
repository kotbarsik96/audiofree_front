import type { ESupportChatSenderType } from "~/domain/support/chat/interfaces/ESupportChatSenderType"
import type { ISupportChatMessage } from "~/domain/support/chat/interfaces/ISupportChatMessage"

export interface ISupportChatMessagesSenderGroup {
  sender_type: ESupportChatSenderType
  messages: ISupportChatMessage[]
}
