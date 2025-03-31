import type { IVariationWithProduct } from '~/domain/product/types/IProductData'

export default interface ICartItem {
  id: number
  is_oneclick: boolean
  quantity: number
  variation_id: number
  variation: IVariationWithProduct
}
