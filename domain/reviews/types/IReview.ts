export default interface IReview {
  user_id: number
  description?: string
  pros?: string
  cons?: string
  value: number
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
  }
}
