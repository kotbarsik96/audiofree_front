import type { WatchHandle } from 'vue'
import type { TValidationError } from './interfaces/TValidationError'
import type { ValidatorCallback } from './interfaces/ValidatorCallback'
import type { TFormValidationField } from './interfaces/TFormValidationField'

export function useValidationField<T>(
  initialValue: T,
  validators: Array<ValidatorCallback<T>>
) {
  const value = ref<T>(initialValue)
  const error = ref<TValidationError | null>(null)
  let watcher: WatchHandle | undefined

  function validate() {
    let isValid = true

    if (!watcher)
      watcher = watch(value, () => {
        if (error.value) validate()
      })

    for (let validator of validators) {
      const result = validator(value.value)
      if (result) {
        isValid = false
        error.value = result
        break
      }
    }

    if (isValid) error.value = null

    return isValid
  }

  return {
    value,
    error,
    validate,
    hasError: computed(() => !!error.value),
    errorMsg: computed(() => error.value?.error),
  }
}

export function useFormValidation(validationFields: TFormValidationField) {
  function validateAll() {
    let isAllValid = true

    for (let field of Object.values(validationFields)) {
      if (!field.validate()) {
        isAllValid = false
      }
    }

    return isAllValid
  }

  function getErrors() {
    const errors: Record<string, string> = {}

    for (let [fieldName, fieldData] of Object.entries(validationFields)) {
      if (fieldData.hasError) {
        errors[fieldName] = fieldData.errorMsg.value as string
      }
    }

    return errors
  }

  return {
    validateAll,
    getErrors,
    fields: validationFields,
  }
}
