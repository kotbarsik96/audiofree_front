import type { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'

export interface ISupportChatMessage {
  id: number
  chat_id: number
  author_id: number
  sender_type: ESupportChatSenderType
  text: string
  read_at?: string
  created_at: string
  updated_at: string
}
