import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'

export interface ISupportChatReadMessagesEvent {
  read_messages_ids: number[]
  chat_info: ISupportChatInfo
  reader_id: number
}
