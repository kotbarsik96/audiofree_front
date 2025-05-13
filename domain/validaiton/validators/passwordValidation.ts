import type { ValidatorCallback } from '../interfaces/ValidatorCallback'

export function passwordValidation(): ValidatorCallback<string> {
  let minLength = 6

  return function (value: string) {
    const hasNumbers = !!value.match(/\d/g)
    const hasUpperCase = !!value.match(/[A-Z]/g)
    const hasLowerCase = !!value.match(/[a-z]/g)

    if (value) {
      if (!hasNumbers && (!hasUpperCase || !hasLowerCase))
        return 'Пароль должен иметь цифры и строчные и заглавные латинские буквы'
      else if (hasNumbers && (!hasUpperCase || !hasLowerCase))
        return 'Пароль должен иметь ещё строчные и заглавные латинские буквы'
      else if (!hasNumbers && hasUpperCase && hasLowerCase)
        return 'Пароль должен иметь ещё хотя бы одну цифру'
      else if (value.length < minLength)
        return `Пароль должен быть от ${minLength} символов`
    }

    return false
  }
}
