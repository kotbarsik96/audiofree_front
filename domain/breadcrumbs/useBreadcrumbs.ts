import type { WatchHandle } from 'vue'
import type { IBreadcrumb } from '~/domain/breadcrumbs/interfaces/IBreadcrumb'
import type { TBreadcrumbsBuilder } from '~/domain/breadcrumbs/interfaces/TBreadcrumbsBuilder'

export const getBreadcrumbs = () => useState<IBreadcrumb[]>('breadcrumbs', () => [])

export function useBreadcrumbs(
  builder: TBreadcrumbsBuilder,
  effect?: MaybeRefOrGetter
) {
  let watcher: WatchHandle
  const breadcrumbs = getBreadcrumbs()
  let isMounted = false

  if (effect) {
    watcher = watch(effect, () => {
      breadcrumbs.value = builder()
    })
  }

  if (typeof window === 'undefined') breadcrumbs.value = builder()

  onMounted(() => {
    isMounted = true
    breadcrumbs.value = builder()
  })

  onBeforeUnmount(() => {
    if (isMounted) {
      if (watcher) watcher()
      breadcrumbs.value = []
      isMounted = false
    }
  })
}
