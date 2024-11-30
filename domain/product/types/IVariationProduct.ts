import type IImage from '~/domain/images/types/IImage'
import type { ProductStatuses } from '~/domain/product/types/ProductStatuses'

export default interface IVariationProduct {
  variation_id: number
  product_id: number
  image: IImage | string
  product_name: string
  variation_name: string
  full_name: string
  price: number
  current_price: number
  discount?: number
  quantity?: number
  rating_value: number | null
  rating_count: number
  status: ProductStatuses
}
