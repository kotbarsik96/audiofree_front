export interface ISupportChatInfo {
  chat_id: number
  unread_messages: number
  total_messages: number
  first_message_id: number
  last_message_id: number
  user_name: string
  user_writing: boolean
  staff_writing: boolean
  staff_writers?: string[]
}
