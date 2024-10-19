import { defineStore } from '#imports'
import { ref, computed } from '#imports'
import { Product } from '~/domain/product/Product'
import type IFilterItem from '~/domain/product/types/IFilterItem'

export const useCatalogStore = defineStore('catalogStore', () => {
  const router = useRouter()
  const route = useRoute()
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

  watch(filterValues, updateUrlQuery, { deep: true })

  async function getFilters() {
    const { data } = await productsService.getCatalogFilters()
    filtersArr.value = data
    mapFilterValuesToInputs()
  }
  /** выставит значения фильтров
   * попытается выставить из query параметра роута, если есть
   * если нет - выставит первые из filterValues (для radio, range)
   */
  function mapFilterValuesToInputs() {
    if (filtersArr.value) {
      filtersArr.value.forEach((filterItem) => {
        const slug = filterItem.slug

        switch (filterItem.type) {
          case 'radio':
            filterValues.value[slug] =
              route.query[slug] || filterItem.values[0]?.value_slug || ''
            break
          case 'checkbox':
            filterValues.value[slug] =
              typeof route.query[slug] === 'string'
                ? [route.query[slug]]
                : route.query[slug] || []
            break
          case 'checkbox_boolean':
            filterValues.value[slug] =
              route.query[slug] === 'false' ? false : !!route.query[slug]
            break
          case 'range':
            let [min, max] = getRangeValues(slug, filterItem)
            filterValues.value[slug] = [Math.floor(min), Math.floor(max)]
            break
        }
      })
    }
  }
  function getRangeValues(slug: string, filterItem: IFilterItem): number[] {
    let rangeValues

    // пришёл массив двух чисел (но в query они в виде строк)
    if (Array.isArray(route.query[slug]))
      rangeValues = route.query[slug].map((str) => Number(str))
    // пришло только одно строковое число
    else {
      const num = Number(route.query[slug]) || 0
      rangeValues = [num, num]
    }

    // далее проверить, что не меньше min и не больше max, и не перекрывают друг друга
    if (filterItem.min && rangeValues[0] < filterItem.min)
      rangeValues[0] = filterItem.min
    if (filterItem.max && rangeValues[1] > filterItem.max)
      rangeValues[1] = filterItem.max
    if (rangeValues[0] > rangeValues[1]) rangeValues[0] = rangeValues[1]

    return rangeValues
  }
  function updateUrlQuery() {
    router.push({
      name: route.name,
      query: toValue(filterValues),
    })
  }

  return {
    filters,
    filterValues,
    getFilters,
  }
})
