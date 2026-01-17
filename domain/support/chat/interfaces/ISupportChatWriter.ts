export interface ISupportChatWriter {
  id: number
  chat_id: number
  name: string
  /** timestamp, когда пользователь начал печатать или false, если не печатает */
  started_writing_at: number | false
}
