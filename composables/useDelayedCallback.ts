export function useDelayedCallback(timeout: number, callback: Function) {
  const timeoutId = ref<number>()

  function refresh() {
    if (timeoutId.value) clearTimeout(timeoutId.value)

    timeoutId.value = setTimeout(callback, timeout)
  }

  return { refresh }
}
