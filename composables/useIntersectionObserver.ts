import type { ShallowRef } from 'vue'

export function useIntersectionObserver(
  element: Readonly<ShallowRef<HTMLElement | null>>,
  /** если callback вернёт true - observer будет остановлен */
  callback: (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver,
  ) => boolean | void,
) {
  let observer: IntersectionObserver | undefined

  onMounted(() => {
    if (element.value) {
      observer = new IntersectionObserver((entries, o) => {
        const result = callback(entries, o)
        if (result === true) disconnect()
      })
      observer.observe(element.value)
    }
  })

  onUnmounted(() => {
    disconnect()
  })

  function disconnect() {
    observer?.disconnect()
    observer = undefined
  }

  return {
    observer,
  }
}
