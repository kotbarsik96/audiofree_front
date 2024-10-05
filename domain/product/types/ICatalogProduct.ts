export default interface ICatalogProduct {
  id: number
  name: string
  image_id: number
  status_id: number
  min_price: number
  max_price: number
  rating: number
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
  status: {
    id: number
    value: string
    value_slug: string
  }
  brand: {
    id: number
    value: string
    value_slug: string
  }
}
