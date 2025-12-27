import type { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'

export interface ISupportChatWriteStatusChangeEvent {
  is_writing: boolean
  writer_id: number
  chat_info: ISupportChatInfo
}
