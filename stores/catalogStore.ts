import { defineStore } from '#imports'
import { ref, computed } from '#imports'
import { Product } from '~/domain/product/Product'
import type IFilterItem from '~/domain/product/types/IFilterItem'

export const useCatalogStore = defineStore('catalogStore', () => {
  const productsService = new Product()

  const filtersArr = ref<IFilterItem[] | null>()
  const filters = computed(() => {
    let obj: Record<string, IFilterItem> = {}
    filtersArr.value?.forEach((filterItem) => {
      obj[filterItem.slug] = filterItem
    })
    return obj
  })
  const filterValues: Record<string, any> = ref({})

  async function getFilters() {
    const { data } = await productsService.getCatalogFilters()
    filtersArr.value = data
    if (filtersArr.value) {
      filtersArr.value.forEach((filterItem) => {
        if (!filterValues.value[filterItem.slug]) {
          if (filterItem.type === 'checkbox') {
            filterValues.value[filterItem.slug] = []
          }
          if (filterItem.type === 'range') {
            filterValues.value[filterItem.slug] = {
              min: filterItem.min,
              max: filterItem.max,
            }
          }
        }
      })
    }
  }

  return {
    filters,
    filterValues,
    getFilters,
  }
})
