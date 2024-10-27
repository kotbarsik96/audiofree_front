export function passwordValidation(): ValidatorCallback {
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

export function emailValidation(): ValidatorCallback {
  return function (value: string) {
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (value && !value.match(regexp)) return 'Некорректный email адрес'

    return false
  }
}

export function mustPresentValidation(fieldName?: string): ValidatorCallback {
  return function (value: string) {
    if (!value) {
      if (fieldName) return `Не указано поле: ${fieldName}`
      else return 'Не указано поле'
    }

    return false
  }
}

export function passwordsMatchValidation(
  password: Ref<string>
): ValidatorCallback {
  return function (value: string): string | false {
    if (password.value && password.value !== value) return 'Пароли не совпадают'
    return false
  }
}

type ValidatorCallback = (value: string) => string | false

/** Выводит ошибку в error.value, если value.value не проходит валидацию по переданным методам */
export function useValidation(
  value: Ref<string>,
  error: Ref<string>,
  validators: ValidatorCallback[]
) {
  watch(value, validate)

  function validate(): boolean {
    let isValid = true

    for (let validator of validators) {
      let result = validator(value.value)
      if (typeof result === 'string') {
        error.value = result
        isValid = false
        break
      }
    }

    if (isValid) error.value = ''
    return isValid
  }

  return { validate }
}

/** Собирает в себя массив useValidation()
 *
 * Вернёт true все useValidation().validate из массива возвращают true, иначе вернёт false
 *
 * Полезно использовать при submit'е формы
 */
export function useAllValidation(
  validations: ReturnType<typeof useValidation>[]
) {
  function validate() {
    let isAllValid = true
    for (let validation of validations) {
      if (!validation.validate()) isAllValid = false
    }
    return isAllValid
  }

  return { validate }
}
