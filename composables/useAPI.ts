import { useFetch, useNuxtApp, type UseFetchOptions } from '#app'

export function useAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>
) {
  return useFetch(url, {
    dedupe: 'defer',
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // credentials: 'include' внимание: при запросах, взаимодействующих с sanctum, необходимо указывать этот параметр
    $fetch: useNuxtApp().$afFetch,
  })
}
