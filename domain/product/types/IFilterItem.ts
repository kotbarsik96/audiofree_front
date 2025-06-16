import type { TFilterType } from './TFilterItem'

export interface IFilterItemValue {
  id?: number
  slug?: string
  value: string
  value_slug: string
}

export type IFilterItem =
  | IFilterOption
  | IFilterRangeItem
  | IFilterInfoItem
  | ICheckboxBooleanItem

export interface IFilterOption {
  id: number
  name: string
  slug: string
  type: TFilterType
  values: Array<{
    id: number
    slug: string
    value: string
    value_slug: string
  }>
}

export interface IFilterRangeItem {
  type: string
  slug: string
  name: string
  min: number
  max: number
}

export interface IFilterInfoItem {
  type: string
  slug: string
  name: string
  values: Array<{
    name: string
    slug: string
    values: Array<string>
  }>
}

export interface ICheckboxBooleanItem {
  type: string
  slug: string
  name: string
  values: Array<{
    value: string
    value_slug: string
  }>
}
