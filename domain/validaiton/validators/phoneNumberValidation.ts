import type { ValidatorCallback } from '../interfaces/ValidatorCallback'

export function phoneNumberValidation(
  unmasked: Ref<string> | null
): ValidatorCallback<string> {
  return function (value: string) {
    if (!!unmasked?.value && !value.match(/\+7 \(\d\d\d\) \d\d\d \d\d \d\d/))
      return { error: 'Неверный формат номера телефона' }

    return false
  }
}
