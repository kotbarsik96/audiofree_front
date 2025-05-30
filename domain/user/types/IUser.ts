import type IUserConfirmations from '~/domain/user/types/IUserConfirmations'

export default interface IUser {
  id: number
  email: string
  email_verified_at: string
  name: string
  phone_number: null | string
  telegram: null | string
  location: null | string
  street: null | string
  house: null | string
  created_at: string
  updated_at: string
  confirmations: IUserConfirmations
}
