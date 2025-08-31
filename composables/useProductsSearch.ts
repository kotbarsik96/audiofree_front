import type ISimplePagination from "~/dataAccess/api/ISimplePagination"
import type { IProductSearchResult } from "~/domain/product_search/IProductSearchResult"
import type { TProductSearchType } from "~/domain/product_search/TProductSearchType"

export const useProductsSearch = (
  searchValue: MaybeRefOrGetter<string>,
  type: TProductSearchType
) => {
  const lastSearchedValue = ref(toValue(searchValue))

  const {
    data: resultsData,
    execute,
    status,
  } = useAPI<ISimplePagination<IProductSearchResult>>('/search/products', {
    params: {
      value: searchValue,
      type,
    },
    watch: false,
    immediate: false,
  })
  const results = computed(() => resultsData.value?.data)
  const { refresh: executeSearchWithDelay } = useDelayedCallback(500, async () => {
    await execute()
    lastSearchedValue.value = toValue(searchValue)
  })
  const isLoading = computed(() => status.value === 'pending')

  return {
    lastSearchedValue,
    isLoading,
    results,
    resultsData,
    executeSearchWithDelay,
    execute,
  }
}