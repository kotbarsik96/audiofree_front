export interface ISupportChatListItem {
  id: number
  status: string
  created_at: string
  updated_at: string
  user_name: string
  user_email?: string
  user_phone?: string
  latest_message: string
}
