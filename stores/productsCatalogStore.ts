import { parseRouteQuery } from '~/utils/general'
import type IFilterItem from '~/domain/product/types/IFilterItem'

export const useProductsCatalogStore = defineStore(
  'productsCatalogStore',
  () => {
    const route = useRoute()
    const router = useRouter()

    // filtersArr, но в виде объекта, где slug каждого элемента массива - ключ
    const filters = computed(() => {
      let obj: Record<string, IFilterItem> = {}
      filtersArr.value?.data.forEach((filterItem) => {
        obj[filterItem.slug] = filterItem
      })
      return obj
    })

    // значения фильтров, выставляемые пользователем
    const filterValues = useState<Record<string, any>>(
      'filter-values',
      () => ({})
    )
    const routeQueryParsed = computed(() => parseRouteQuery(route.query))

    const { data: filtersArr, execute } = useAPI<{ data: IFilterItem[] }>(
      `/products/catalog/filters`,
      {
        query: routeQueryParsed,
        immediate: false,
        watch: false,
        async onResponse({ response }) {
          mapFiltersArrToInputs(response._data.data || [])
        },
      }
    )

    let filterValuesTimeout: ReturnType<typeof setTimeout>

    watch(filterValues, onFilterValuesUpdate, { deep: true })

    /** заполнит пустые/отсутствующие поля в filterValues данными
     * сначала попробует взять из routeQueryParsed
     * если там данных по slug'у нет, возьмёт первое значение из arr[arr.indexOf(filterItem)]
     */
    function mapFiltersArrToInputs(arr: IFilterItem[]) {
      arr.forEach((filterItem) => {
        const slug = filterItem.slug
        const filterValue = filterValues.value[slug]

        let valueInQuery = routeQueryParsed.value[slug]

        switch (filterItem.type) {
          case 'radio':
            if (typeof filterValue !== 'string') {
              valueInQuery = parseToType<string>(valueInQuery, 'string')
              filterValues.value[slug] =
                valueInQuery || filterItem.values[0]?.value_slug
            }
            break
          case 'range':
            if (
              !Array.isArray(filterValue) ||
              filterValue.some((item: any) => typeof item !== 'number')
            ) {
              let [min, max] = getRangeValues(slug, filterItem)
              filterValues.value[slug] = [Math.ceil(min), Math.floor(max)]
            }
            break
          case 'checkbox':
            if (!Array.isArray(filterValue)) {
              valueInQuery = parseToType<any[]>(valueInQuery, 'array')
              filterValues.value[slug] = valueInQuery || []
            }
            break
          case 'checkbox_boolean':
            if (typeof filterValue !== 'boolean') {
              valueInQuery = parseToType<boolean>(valueInQuery, 'boolean')
              filterValues.value[slug] = valueInQuery || false
            }
            break
        }

        /** далее проверит поля range на соответствие min и max */
        if (filterItem.type === 'range') {
          if (filterItem.min && filterValues.value[slug][0] < filterItem.min)
            filterValues.value[slug][0] = Math.ceil(filterItem.min)
          if (filterItem.max && filterValues.value[slug][1] > filterItem.max)
            filterValues.value[slug][1] = Math.floor(filterItem.max)
        }
      })
    }
    function getRangeValues(slug: string, filterItem: IFilterItem): number[] {
      let rangeValues

      let valueInQuery = routeQueryParsed.value[slug]
      // пришла строка вида '100,200' - сделать [100, 200]
      if (typeof valueInQuery === 'string') {
        valueInQuery = valueInQuery
          .split(',')
          .map((str) => Number(str))
          .filter((num) => num)
      }

      // в query массив чисел
      if (Array.isArray(valueInQuery) && valueInQuery.length > 0)
        rangeValues = valueInQuery
      // в query нет ничего - выставить значения из фильтров
      else rangeValues = [filterItem.min || 0, filterItem.max || 0]

      if (rangeValues.length === 1) rangeValues[1] = rangeValues[0]

      // далее проверить, что не меньше min и не больше max, и не перекрывают друг друга
      if (filterItem.min && rangeValues[0] < filterItem.min)
        rangeValues[0] = filterItem.min
      if (filterItem.max && rangeValues[1] > filterItem.max)
        rangeValues[1] = filterItem.max
      if (rangeValues[0] > rangeValues[1]) rangeValues[0] = rangeValues[1]

      return rangeValues
    }
    function onFilterValuesUpdate() {
      if (filterValuesTimeout) clearTimeout(filterValuesTimeout)
      filterValuesTimeout = setTimeout(updateUrlQuery, 1500)
    }
    async function updateUrlQuery() {
      const query = toValue(filterValues)

      const slugs = Object.keys(filters.value)
      Object.entries(route.query).forEach(([key, value]) => {
        if (slugs.includes(key)) return

        // числа преобразовать в строки
        if (Array.isArray(value) && value.some((v) => typeof v === 'number'))
          query[key] = value.map((v: any) =>
            typeof v === 'number' ? v.toString() : v
          )
        else query[key] = value
      })

      // сначала нужно очистить query, иначе будут дублироваться некоторые значения
      await router.replace({ query: {} })
      await router.push({ query })
    }
    async function applyFilter() {
      clearTimeout(filterValuesTimeout)
      await updateUrlQuery()
      await execute()
    }

    return {
      filters,
      filterValues,
      applyFilter,
    }
  }
)
