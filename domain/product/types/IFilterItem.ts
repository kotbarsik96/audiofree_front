export default interface IFilterItem {
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
  min?: number
  max?: number
}
