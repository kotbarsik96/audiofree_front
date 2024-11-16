import type { WatchHandle } from 'vue'

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

export function emailValidation(): ValidatorCallback<string> {
  return function (value: string) {
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (value && !value.match(regexp)) return 'Некорректный email адрес'

    return false
  }
}

export function mustPresentValidation(
  fieldName?: string
): ValidatorCallback<string> {
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
): ValidatorCallback<string> {
  return function (value: string): string | false {
    if (password.value && password.value !== value) return 'Пароли не совпадают'
    return false
  }
}

export function phoneNumberValidation(): ValidatorCallback<string> {
  return function (value: string) {
    if (!value.match(/\+7 \(\d\d\d\) \d\d\d \d\d \d\d/))
      return 'Неверный формат номера телефона'

    return false
  }
}

export function minLengthValidation(
  minLength: number
): ValidatorCallback<string> {
  return function (value: string) {
    if (value.length < minLength) return `Не менее ${minLength} символов`

    return false
  }
}

export function minNumberValidation(
  minNumber: number
): ValidatorCallback<number> {
  return function (value: number) {
    if (value < minNumber) return `Число от ${minNumber}`

    return false
  }
}

type ValidatorCallback<T> = (value: T) => string | false

export interface IValidationOptions {
  /** по умолчанию, watcher валидации откладывается до момента вызова startWatching
   *
   * при использовании внутри useValidAll, startWatching будет вызван при useValidAll.validate
   */
  watchImmediately?: boolean
}

/** Выводит ошибку в error.value, если value.value не проходит валидацию по переданным методам
 *
 *
 */
export function useValidation<T = string>(
  value: Ref<T>,
  error: Ref<string>,
  validators: ValidatorCallback<any>[],
  options?: IValidationOptions
) {
  let watcher: WatchHandle | undefined
  if (options?.watchImmediately) startWatching()

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
  /** Поставит watch на value, если его ещё нет */
  function startWatching() {
    if (!watcher) watcher = watch(value, validate)
  }

  return { validate, startWatching }
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
      validation.startWatching()
      if (!validation.validate()) isAllValid = false
    }
    return isAllValid
  }

  return { validate }
}
