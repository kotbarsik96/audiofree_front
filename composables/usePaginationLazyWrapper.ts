import type { UseFetchOptions } from '#app'
import type IPagination from '~/dataAccess/api/IPagination'
import { type NitroFetchOptions } from 'nitropack'

export type PaginationLazyWrapperOptions<T> = UseFetchOptions<{
  data: IPagination<T>
}> &
  NitroFetchOptions<string>

export async function usePaginationLazyWrapper<T>(
  intersectionEl: Ref<HTMLElement | undefined>,
  url: string,
  options: PaginationLazyWrapperOptions<T>
) {
  const { $afFetch } = useNuxtApp()

  const list = shallowRef<T[]>([])
  const page = ref(1)
  const isLoading = ref(false)
  const paginationData = ref<IPagination<T>>()

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

    isLoading.value = false

    if (responseData.data.value) list.value = responseData.data.value?.data.data
    paginationData.value = responseData.data.value?.data

    return responseData
  }
  async function _intersectionCallback(entries: IntersectionObserverEntry[]) {
    if (isLastPage.value) return

    if (entries.some((entry) => entry.isIntersecting)) {
      await _loadMore()
    }
  }
  async function _loadMore() {
    if (isLoading.value) return
    isLoading.value = true

    page.value++
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
    const response = await $afFetch<{ data: IPagination<T> } | null>(url, opts)
    if (response?.data.data) list.value = list.value.concat(response.data.data)
    paginationData.value = response?.data

    isLoading.value = false
  }
  async function reset() {
    page.value = 0
    list.value = []
    await _loadMore()
  }

  return {
    list,
    isLoading,
    reset,
  }
}
