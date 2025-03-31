import type IImage from '~/domain/images/types/IImage'

export interface IOrderProduct {
  id: number
  order_id: number
  product_name: string
  product_quantity: number
  product_price: number
  product_total_cost: number
  variation: {
    id: number
    slug: string
    image_id: number
    image: IImage
    product: {
      id: number
      slug: string
    }
  }
}
