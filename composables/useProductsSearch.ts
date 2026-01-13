import type ISimplePagination from '~/dataAccess/api/ISimplePagination'
import type { IProductSearchResult } from '~/domain/product_search/IProductSearchResult'
import type { TProductSearchType } from '~/domain/product_search/TProductSearchType'

export const useProductsSearch = (
  searchValue: MaybeRefOrGetter<string>,
  type: TProductSearchType,
  page?: MaybeRefOrGetter<number>
) => {
  const lastSearchedValue = ref(toValue(searchValue))
  const _page = computed(() => {
    if (!page || type === 'searchbar') return 1
    return toValue(page)
  })

  const {
    data: resultsData,
    execute,
    status,
  } = useAPI<ISimplePagination<IProductSearchResult>>('/search/products', {
    params: {
      value: searchValue,
      type,
      page: _page,
    },
    watch: false,
    immediate: false,
  })
  const results = computed(() => resultsData.value?.data)
  const { fn: executeSearchWithDelay } = debounce(async () => {
    await execute()
    lastSearchedValue.value = toValue(searchValue)
  }, 500)
  const isLoading = computed(() => status.value === 'pending')
  const pagination = computed(() => resultsData.value?.pagination)

  /** При указании "watch: [_page]" в useAPI работает некорректно и почему-то отслеживает searchValue */
  watch(_page, () => execute())

  return {
    lastSearchedValue,
    isLoading,
    results,
    resultsData,
    executeSearchWithDelay,
    execute,
    pagination,
  }
}
