export type TPaymentTypes = 'cash' | 'card'

export const paymentTypesMap: Record<TPaymentTypes, string> = {
  cash: 'Наличными',
  card: 'Картой'
}