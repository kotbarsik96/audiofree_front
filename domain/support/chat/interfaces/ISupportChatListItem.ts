import type { ESupportChatStatus } from '~/domain/support/chat/interfaces/ESupportChatStatus'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'

export interface ISupportChatListItem {
  id: number
  status: ESupportChatStatus
  created_at: string
  updated_at: string
  user_name: string
  user_email?: string
  user_phone?: string
  user_telegram?: string
  latest_message?: ISupportChatMessage
  writers_count: number
  unread_messages: number
}
