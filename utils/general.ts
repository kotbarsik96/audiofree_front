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

export function parseToType<T>(
  value: any,
  mustBeType: 'number' | 'string' | 'boolean' | 'array'
): T | null | undefined {
  if (typeof value === 'undefined' || value === null) return value

  let _value = value
  if (typeof value !== mustBeType) {
    switch (mustBeType) {
      case 'number':
        _value = Number(value) || 0
        break
      case 'string':
        _value = value?.toString() || ''
        break
      case 'boolean':
        if (value === 'false') _value = false
        else if (value === 'true') _value = true
        break
      case 'array':
        if (!Array.isArray(value)) {
          if (typeof value === 'string' && value.includes(','))
            _value = value.split(',')
          else _value = [value]
        }
        break
    }
  }
  return _value
}
