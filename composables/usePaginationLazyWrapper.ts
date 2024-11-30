import type { UseFetchOptions } from '#app'
import type IPagination from '~/dataAccess/api/IPagination'

export function usePaginationLazyWrapper<T>(
  intersectionEl: Ref<HTMLElement | undefined>,
  url: string,
  options: UseFetchOptions<{ data: IPagination<T> }>
) {
  const asyncData = useAPI<{
    data: IPagination<T>
  }>(url, { ...options, immediate: false })

  const page = ref(0)
  let observer: IntersectionObserver

  const paginationData = computed(() => asyncData.data.value?.data)
  const isLastPage = computed(
    () =>
      !paginationData.value?.last_page ||
      page.value >= paginationData.value?.last_page
  )

  onMounted(() => {
    if (intersectionEl.value) {
      observer = new IntersectionObserver(loadMoreCallback, {
        rootMargin: '0px 0px 0px 0px',
        threshold: 1,
      })
      observer.observe(intersectionEl.value)
    }
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  async function loadMoreCallback() {
    if (isLastPage.value) return

    page.value++
    asyncData.refresh()
  }

  return asyncData
}
