import type { ValidatorCallback } from '../interfaces/ValidatorCallback'

export function mustPresentValidation(
  fieldName?: string
): ValidatorCallback<string> {
  return function (value: string) {
    if (!value) {
      if (fieldName) return { error: `Не указано поле: ${fieldName}` }
      else return { error: 'Не указано поле' }
    }

    return false
  }
}
