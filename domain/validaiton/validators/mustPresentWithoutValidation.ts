import type { ValidatorCallback } from '../interfaces/ValidatorCallback'

interface IMustPresentWithoutValidationOptions {
  /** Указывается, когда валидируется значение из MaskInput */
  unmaskedValue?: Ref<string>
  /** Указать другое сообщение при ошибке */
  message?: string
}

/** Поле обязательно только тогда, когда не указаны остальные поля в массиве without */
export function mustPresentWithout(
  without: Array<Ref<string>>,
  options?: IMustPresentWithoutValidationOptions
): ValidatorCallback<string> {
  return function (value: string) {
    let msg = options?.message || 'Не указано ни одно из обязательных полей'
    const otherFieldIsPresented = without.some((field) => !!field.value)
    const hasValue = options?.unmaskedValue
      ? !!options.unmaskedValue.value
      : !!value

    if (!hasValue && !otherFieldIsPresented) {
      return msg
    }

    return false
  }
}
