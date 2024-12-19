import { useGlobalStore } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const { setPendingBreadcrumbs, breadCrumbs } = useBreadcrumbs()
  const { pageIsLoading } = storeToRefs(useGlobalStore())

  nuxtApp.hook('page:start', () => {
    pageIsLoading.value = true
  })
  nuxtApp.hook('page:finish', () => {
    pageIsLoading.value = false
    setPendingBreadcrumbs(breadCrumbs.value)
  })
})
