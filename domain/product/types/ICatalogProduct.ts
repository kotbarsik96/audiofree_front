export default interface ICatalogProduct {
  id: number
  name: string
  image_id: number
  status_id: number
  min_price: number
  max_price: number
  image: {
    id: number
    name: string
    extension: string
    path: string
    alt: null | string
    disk: string
    url: string
    relativeUrl: string
  }
  first_variation: {
    id: number
    product_id: number
  }
}
