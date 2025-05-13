import type { ValidatorCallback } from '../interfaces/ValidatorCallback'

export function emailValidation(): ValidatorCallback<string> {
  return function (value: string) {
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (value && !value.match(regexp)) return 'Некорректный email адрес'

    return false
  }
}
