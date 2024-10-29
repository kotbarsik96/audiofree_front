import type IImage from '~/domain/images/types/IImage'

export interface IProductVariation {
  id: number
  name: string
  image_id: number
  price: number
  discount: number
  quantity: number
}

export interface IProduct {
  id: number
  name: string
  description: string
  image_id: number
  status_id: number
  brand_id: number
  category_id: number
  type_id: number
}

export interface IProductData {
  product: IProduct
  variations: IProductVariation[]
  rating: number
  images: IImage[]
}
