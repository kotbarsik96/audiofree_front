import { inject } from 'vue'
import type { InjectionKey } from 'vue'
import type { LocationQueryValue, RouteQueryAndHash } from 'vue-router'

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

/** если value - строка, пытается парсить её в false, true, Number(). При неудаче вернёт строку
 *
 * если value - массив, проделает вышеописанное с его значениями
 */
export function parseStringValue(
  value: LocationQueryValue | LocationQueryValue[]
): string | number | LocationQueryValue | LocationQueryValue[] {
  let _value: any = value

  if (typeof value === 'string') {
    if (value === 'false') _value = false
    else if (value === 'true') _value = true
    else {
      const num = Number(value)
      _value = isNaN(num) ? value : num
    }
  }
  if (Array.isArray(value))
    _value = value.map((subValue) => parseStringValue(subValue)).join(',')

  return _value
}

/** вернёт routeQuery с изменениями:
 * распарсит строки чисел в number, 'false'/'true' в boolean
 *
 * массивы сделает строкой вида: key=value1,value2,value3
 */
export function parseRouteQuery(routeQuery: RouteQueryAndHash) {
  let obj: Record<string, any> = {}
  Object.entries(routeQuery).forEach(([slug, value]) => {
    obj[slug] = parseStringValue(value)
  })
  return obj
}

/** выведет лог, подписав его сверху и снизу */
export function debugLog(data: any, wrapperMessage?: string) {
  console.log(`${wrapperMessage} - start`)
  console.log(data)
  console.log(`${wrapperMessage} - end`)
}

/** выведет ошибку, подписав его сверху и снизу */
export function debugError(data: any, wrapperMessage?: string) {
  console.log(`${wrapperMessage} - start`)
  console.error(data)
  console.log(`${wrapperMessage} - end`)
}

/** выведет предупреждение, подписав его сверху и снизу */
export function debugWarn(data: any, wrapperMessage?: string) {
  console.log(`${wrapperMessage} - start`)
  console.warn(data)
  console.log(`${wrapperMessage} - end`)
}