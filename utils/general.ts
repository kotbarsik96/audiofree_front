import type { LocationQueryValue, RouteQueryAndHash } from 'vue-router'
import type INuxtFetchResponse from '~/dataAccess/api/INuxtFetchResponse'
import { ServerStatuses } from '~/enums/ServerStatuses'

export function delay(timeoutMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeoutMs)
  })
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
  if (import.meta.env.MODE === 'development') {
    console.log(`${wrapperMessage} - start`)
    console.log(data)
    console.log(`${wrapperMessage} - end`)
  }
}

/** выведет ошибку, подписав его сверху и снизу */
export function debugError(data: any, wrapperMessage?: string) {
  if (import.meta.env.MODE === 'development') {
    console.log(`${wrapperMessage} - start`)
    console.error(data)
    console.log(`${wrapperMessage} - end`)
  }
}

/** выведет предупреждение, подписав его сверху и снизу */
export function debugWarn(data: any, wrapperMessage?: string) {
  if (import.meta.env.MODE === 'development') {
    console.log(`${wrapperMessage} - start`)
    console.warn(data)
    console.log(`${wrapperMessage} - end`)
  }
}

type IErrorMapper = [string, Ref]

export function mapErrorsFromResponse(
  response: INuxtFetchResponse,
  mappers: IErrorMapper[]
) {
  // если есть массив с ошибками - размапить их в mappers
  if (response._data.errors) {
    mappers.forEach(([key, refVar]) => {
      if (response._data.errors[key])
        refVar.value = response._data.errors[key][0]
    })
  }
  // если массива нет, но есть message
  else if (response._data.message) {
    // разместить ошибку в первый элемент mappers[0], если есть
    if (mappers[0]) {
      const [_, refVar] = mappers[0]
      refVar.value = response._data.message
    }
    // если mappers[0] нет, то вывести ошибку в нотификацию
    else {
      const { addNotification } = useNotifications()
      addNotification('error', response._data.message)
    }
  }
}

export function isResponseOk(status: number) {
  return [
    ServerStatuses.OK,
    ServerStatuses.CREATED,
    ServerStatuses.ACCEPTED,
  ].includes(status)
}

export function debounce(fn: Function, wait: number) {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn(...args)
    }, wait);
  };
}