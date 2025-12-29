import type { UseFetchOptions } from '#app'
import type IPagination from '~/dataAccess/api/IPagination'
import { type NitroFetchOptions } from 'nitropack'
import type { ShallowRef } from 'vue'

export type PaginationLazyWrapperOptions<T> = UseFetchOptions<{
  data: IPagination<T>
}> &
  NitroFetchOptions<string>

type TLoadMoreResponse<T> = { data: IPagination<T> } | null

export async function usePaginationLazyWrapper<T>(
  listRef: Ref<T[]> | ShallowRef<T[]>,
  intersectionEl: Ref<HTMLElement | undefined | null>,
  url: string,
  options: PaginationLazyWrapperOptions<T>
) {
  const { $afFetch } = useNuxtApp()

  const list = listRef ?? shallowRef<T[]>([])
  const page = ref(1)
  const isLoading = ref(false)
  const paginationData = ref<IPagination<T>>()
  const error = ref()
  let loadingMorePromise: Promise<TLoadMoreResponse<T>> | undefined

  const isLastPage = computed(
    () =>
      !paginationData.value?.last_page ||
      page.value >= paginationData.value?.last_page
  )

  let observer: IntersectionObserver
  onMounted(() => {
    if (intersectionEl.value) {
      observer = new IntersectionObserver(_intersectionCallback, {
        rootMargin: '0px 0px 100px 0px',
        threshold: 1,
      })
      observer.observe(intersectionEl.value)
    }
  })
  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  const queryWithDefaults: Record<string, any> = {
    ...options.query,
    page,
  }
  const optionsWithDefaults: PaginationLazyWrapperOptions<T> = {
    ...options,
    method: 'GET',
    watch: false,
    query: queryWithDefaults,
  }

  await _getData()

  /** первое получение данных */
  async function _getData() {
    isLoading.value = true

    const responseData = await useAPI<{
      data: IPagination<T>
    }>(url, optionsWithDefaults)

    if (responseData.error) error.value = responseData.error.value

    isLoading.value = false

    if (responseData.data.value) list.value = responseData.data.value?.data.data
    paginationData.value = responseData.data.value?.data

    return responseData
  }
  async function _intersectionCallback(entries: IntersectionObserverEntry[]) {
    if (isLastPage.value || isLoading.value) return

    if (entries.some((entry) => entry.isIntersecting)) {
      page.value++
      await _loadMore()
    }
  }
  async function _loadMore(resetList?: boolean) {
    if (isLoading.value) return
    isLoading.value = true

    let opts: NitroFetchOptions<string> = toValue(
      ref({
        ...options,
        query: {
          ...queryWithDefaults,
          page: page.value,
        },
        onResponseError(responseData) {
          showResponseMessage(responseData.response, { noOkResponse: true })
          if (typeof options.onResponseError === 'function')
            options.onResponseError(responseData)
        },
      })
    )

    try {
      // промис нужен, чтобы обождать его в fullRefresh
      loadingMorePromise = $afFetch<TLoadMoreResponse<T>>(url, opts)
      const response = await loadingMorePromise

      if (resetList) list.value = []
      if (response?.data.data)
        list.value = list.value.concat(response.data.data)
      paginationData.value = response?.data
    } catch (err) {}

    loadingMorePromise = undefined

    isLoading.value = false
  }
  async function reset() {
    page.value = 1
    await _loadMore(true)
  }
  /** загрузить ещё к существующим записям */
  async function refresh() {
    _loadMore()
  }
  /** полностью обновить существующие записи */
  async function fullRefresh() {
    isLoading.value = true

    let opts: NitroFetchOptions<string> = toValue(
      ref({
        ...options,
        query: {
          ...queryWithDefaults,
          page: 1,
          per_page: list.value.length,
        },
        onResponseError(responseData) {
          showResponseMessage(responseData.response, { noOkResponse: true })
          if (typeof options.onResponseError === 'function')
            options.onResponseError(responseData)
        },
      })
    )

    // если данные уже подгружаются - подождать их и только после подгрузки полностью перезапросить
    if (loadingMorePromise) {
      await loadingMorePromise
      isLoading.value = true
    }

    try {
      const response = await $afFetch<TLoadMoreResponse<T>>(url, opts)
      if (response?.data.data) list.value = response.data.data
    } catch (err) {}

    isLoading.value = false
  }

  return {
    list,
    paginationData,
    isLoading,
    reset,
    refresh,
    fullRefresh,
    error,
    isLastPage,
  }
}
