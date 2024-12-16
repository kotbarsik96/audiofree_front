import type { UseFetchOptions } from '#app'
import type IPagination from '~/dataAccess/api/IPagination'

export function usePaginationLazyWrapper<T>(
  intersectionEl: Ref<HTMLElement | undefined>,
  url: string,
  options: UseFetchOptions<{ data: IPagination<T> }>
) {
  const list = ref<T[]>([])
  const page = ref(1)
  let observer: IntersectionObserver

  const queryWithDefaults: Record<string, any> = {
    ...options.query,
    page,
  }
  const optionsWithDefaults: UseFetchOptions<{ data: IPagination<T> }> = {
    ...options,
    query: queryWithDefaults,
    immediate: false,
    onResponse(responseData) {
      const response = responseData.response
      list.value.push(...response._data.data.data)

      if (typeof options.onResponse === 'function')
        options.onResponse(responseData)
    },
  }

  const asyncData = useAPI<{
    data: IPagination<T>
  }>(url, optionsWithDefaults)

  const isLoading = computed(() => asyncData.status.value === 'pending')

  const paginationData = computed(() => asyncData.data.value?.data)
  const isLastPage = computed(
    () =>
      !paginationData.value?.last_page ||
      page.value >= paginationData.value?.last_page
  )

  onMounted(() => {
    if (intersectionEl.value) {
      observer = new IntersectionObserver(loadMoreCallback, {
        rootMargin: '0px 0px 100px 0px',
        threshold: 1,
      })
      observer.observe(intersectionEl.value)
    }
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  async function loadMoreCallback(entries: IntersectionObserverEntry[]) {
    if (isLastPage.value) return

    if (entries.some((entry) => entry.isIntersecting)) {
      page.value++
      asyncData.refresh()
    }
  }
  async function refresh() {
    page.value = 1
    list.value = []
    await asyncData.refresh()
  }
  function execute() {
    refresh()
  }

  return {
    list,
    isLoading,
    error: asyncData.error,
    refresh,
    execute,
  }
}
