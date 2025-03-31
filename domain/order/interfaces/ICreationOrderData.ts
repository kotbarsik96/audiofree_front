import type { TDeliveryPlaces } from '../types/TDeliveryPlaces'
import type { TPaymentTypes } from '../types/TPaymentTypes'

export interface ICreationOrderData {
  variants: {
    delivery_places: Array<TDeliveryPlaces>
    payment_types: Array<TPaymentTypes>
  }
  summary: {
    order_cost: number
    delivery_cost: number
    total_cost: number
  }
}
