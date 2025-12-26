import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'

export interface ISupportChatMessageCreatedEvent {
  message: ISupportChatMessage
  chat_info: ISupportChatInfo
}
