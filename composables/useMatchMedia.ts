import { ref, readonly } from 'vue'

/* если используется не внутри компонента, указать setOnUnmount = false  */
export function useMatchMedia(query: string) {
  let _query = query.match(/^\(.+\)$/) ? query : `(${query})`
  let media: MediaQueryList | undefined
  const _matches = ref(false)
  const matches = readonly(_matches)

  onMounted(() => {
    media = window.matchMedia(_query)
    media.addEventListener('change', onChange)
    _matches.value = media.matches
  })
  onUnmounted(() => {
    if (media) media.removeEventListener('change', onChange)
    media = undefined
  })

  function onChange() {
    _matches.value = media?.matches || false
  }

  return { matches }
}
