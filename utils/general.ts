import { inject } from 'vue'
import type { InjectionKey } from 'vue'

export function delay(timeoutMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeoutMs)
  })
}

export function injectStrict<T>(key: InjectionKey<T>, fallback?: T) {
  const resolved = inject(key, fallback)
  if (!resolved) {
    throw new Error(`Could not resolve ${key.description}`)
  }

  return resolved
}
