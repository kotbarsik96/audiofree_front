export default interface IFiltersList {
  id?: number
  name: string
  slug: string
  type: 'checkbox' | 'radio' | 'range'
  values: {
    id?: number
    slug?: string
    value: string
    value_slug: string
  }[]
}
