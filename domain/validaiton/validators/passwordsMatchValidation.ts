import type { ValidatorCallback } from '../interfaces/ValidatorCallback'

export function passwordsMatchValidation(
  password: Ref<string>
): ValidatorCallback<string> {
  return function (value: string) {
    if (password.value && password.value !== value) return 'Пароли не совпадают'
    return false
  }
}
