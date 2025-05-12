import type { ValidatorCallback } from '../interfaces/ValidatorCallback'

export function minLengthValidation(
  minLength: number
): ValidatorCallback<string> {
  return function (value: string) {
    if (value.length < minLength)
      return { error: `Не менее ${minLength} символов` }

    return false
  }
}
