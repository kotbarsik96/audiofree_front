import type IImage from '~/domain/images/types/IImage'

export interface IProductTaxonomy {
  id: number
  slug: string
  value: string
  value_slug: string
}

export interface IProductInfo {
  id: number
  product_id: number
  name: string
  value: string
}

export interface IProductVariation {
  id: number
  product_id: number
  name: string
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
  status: IProductTaxonomy
  brand: IProductTaxonomy
  category: IProductTaxonomy
  type: IProductTaxonomy
  info: IProductInfo[]
  variations: IProductVariation[]
}

export interface IVariation {
  id: number
  price: number
  discount: number
  name: string
  quantity: number
  current_price: number
  gallery: IImage[]
}

export interface IProductData {
  product: IProduct
  variation: IVariation
  rating: number
}
