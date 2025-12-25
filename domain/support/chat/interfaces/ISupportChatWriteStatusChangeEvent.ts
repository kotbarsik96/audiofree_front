import type { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'

export interface ISupportChatWriteStatusChangeEvent {
  is_writing: boolean
  sender: ESupportChatSenderType
  chat_info: ISupportChatInfo
}
