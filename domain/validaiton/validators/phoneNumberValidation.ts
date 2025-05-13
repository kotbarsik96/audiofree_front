import type { ValidatorCallback } from '../interfaces/ValidatorCallback'

export function phoneNumberValidation(): ValidatorCallback<string> {
  return function (value: string) {
    if (!value.match(/\+7 \(\d\d\d\) \d\d\d \d\d \d\d/))
      return 'Неверный формат номера телефона'

    return false
  }
}
