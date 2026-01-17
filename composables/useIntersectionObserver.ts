import type { ShallowRef } from 'vue'

export function useIntersectionObserver(
  element: Readonly<ShallowRef<HTMLElement | null>>,
  /** если callback вернёт true - observer будет остановлен */
  callback: (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver,
  ) => boolean | void | Promise<void>,
  /** опции должны быть сгенерированы при onMounted (потому, как, например, нужно передать в root какой-то элемент)
   *
   * в связи с этим опции передаются callback'ом
   */
  getObserverOptions?: () => IntersectionObserverInit,
  /** если true - нужно инициализировать через метод init. Иначе автоматически инициализируется при onMounted
   * 
   * полезно, если нужно отложить инициализацию
   */
  initManually?: boolean,
) {
  let observer: IntersectionObserver | undefined

  const init = () => {
    if (element.value) {
      const observerCallback: IntersectionObserverCallback = (entries, o) => {
        const result = callback(entries, o)
        if (result === true) disconnect()
      }

      const observerOptions =
        typeof getObserverOptions === 'function'
          ? getObserverOptions()
          : undefined

      observer = new IntersectionObserver(observerCallback, observerOptions)
      observer.observe(element.value)
    }
  }

  const disconnect = () => {
    observer?.disconnect()
    observer = undefined
  }

  onMounted(() => {
    if (!initManually) init()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    observer,
    init,
    disconnect,
  }
}
