import type IImage from '~/domain/images/types/IImage'
import type { IOrdererData } from '~/domain/order/interfaces/IOrdererData'
import type { IOrderProduct } from '~/domain/order/interfaces/IOrderProduct'
import type { TDeliveryPlaces } from '~/domain/order/types/TDeliveryPlaces'
import type { TOrderStatus } from '~/domain/order/types/TOrderStatus'
import type { TPaymentTypes } from '~/domain/order/types/TPaymentTypes'

export interface IOrderListItem {
  id: number
  orderer_data: IOrdererData
  delivery_place: TDeliveryPlaces
  delivery_address: string
  order_status: TOrderStatus
  desired_payment_type: TPaymentTypes
  is_paid: number
  image_id: number
  created_at: string
  updated_at: string
  total_cost: number
  image: IImage
  products: Array<IOrderProduct>
}
