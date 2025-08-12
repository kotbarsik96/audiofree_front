import { useFetch, useNuxtApp, type UseFetchOptions } from '#app'

export function useAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>
) {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if(import.meta.server) {
    headers['cookie'] = useRequestHeaders(['cookie']).cookie || '';
    headers['origin'] = import.meta.env.VITE_FRONT_URL
  }

  return useFetch(url, {
    dedupe: 'defer',
    ...options,
    headers,
    // credentials: 'include' внимание: при запросах, взаимодействующих с sanctum, необходимо указывать этот параметр
    $fetch: useNuxtApp().$afFetch,
  })
}
