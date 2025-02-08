export interface IFilterItemValue {
  id?: number
  slug?: string
  value: string
  value_slug: string
}

export default interface IFilterItem {
  id?: number
  name: string
  slug: string
  type: 'checkbox' | 'checkbox_boolean' | 'radio' | 'range'
  values?: Array<IFilterItemValue>
  min?: number
  max?: number
  /** определяет, зависит ли фильтр от других значений фильтров */
  is_dependant?: boolean
}
