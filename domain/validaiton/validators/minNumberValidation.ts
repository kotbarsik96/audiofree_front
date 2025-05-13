import type { ValidatorCallback } from '../interfaces/ValidatorCallback'

export function minNumberValidation(
  minNumber: number
): ValidatorCallback<number> {
  return function (value: number) {
    if (value < minNumber) return `Число от ${minNumber}`

    return false
  }
}
