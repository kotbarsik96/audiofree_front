import type { ESupportChatStatus } from '~/domain/support/chat/interfaces/ESupportChatStatus'

export interface ISupportChatListItem {
  id: number
  status: ESupportChatStatus
  created_at: string
  updated_at: string
  user_name: string
  user_email?: string
  user_phone?: string
  user_telegram?: string
  latest_message: string
  writers_count: number
  unread_messages: number
}
