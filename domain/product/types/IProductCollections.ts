export interface IProductCollectionItem {
  variation_id: number
  product_id: number
}

export interface IProductCartCollectionItem extends IProductCollectionItem {
  quantity: number
}

export interface IProductCollections {
  cart: IProductCartCollectionItem[]
  favorites: IProductCollectionItem[]
}
