import type { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'

export interface ISupportChatWriteStatusChangeEvent {
  is_writing: boolean
  sender: ESupportChatSenderType
  chat_id: number
}
