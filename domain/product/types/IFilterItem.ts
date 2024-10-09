export default interface IFilterItem {
  id?: number
  name: string
  slug: string
  type: 'checkbox' | 'checkbox_boolean' | 'radio' | 'range'
  booleanCheckbox?: boolean
  values: {
    id?: number
    slug?: string
    value: string
    value_slug: string
  }[]
  min?: number
  max?: number
}
