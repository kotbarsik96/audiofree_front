import type IImage from '~/domain/images/types/IImage'
import type { ProductStatuses } from '~/domain/product/types/ProductStatuses'

export default interface ICatalogProduct {
  id: number
  slug: string
  name: string
  image_id: number
  status_id: number
  min_price: number
  max_price: number
  rating_value: number
  rating_count: number
  image: IImage | string
  first_variation: {
    id: number
    product_id: number
    slug: string
  }
  status: {
    id: number
    value: string
    value_slug: ProductStatuses
  }
  brand: {
    id: number
    value: string
    value_slug: ProductStatuses
  }
}
