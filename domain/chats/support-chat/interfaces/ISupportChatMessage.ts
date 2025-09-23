export interface ISupportChatMessage {
  id: number
  message_text: string
  by_user: boolean
  author: string
  was_read: boolean | null
  created_at: string
  updated_at: string
}
