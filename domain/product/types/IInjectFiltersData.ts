import type IFilterItem from '~/domain/product/types/IFilterItem'

export interface IInjectFiltersData {
  filters: Ref<Record<string, IFilterItem>>
  filterValues: Ref<Record<string, any>>,
  updateFilters: (slug: string, value: any) => void
}
