import type { TFilterType } from './TFilterItem'

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
  type: TFilterType
  values?: Array<IFilterItemValue>
  min?: number
  max?: number
}
