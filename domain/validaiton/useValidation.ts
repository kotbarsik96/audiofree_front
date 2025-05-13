import type { WatchHandle } from 'vue'
import type { ValidatorCallback } from './interfaces/ValidatorCallback'
import type { TFormValidationField } from './interfaces/TFormValidationField'
import type { IValidationFormOptions } from './interfaces/IValidationFormOptions'

export function useValidationField<T>(
  initialValue: T,
  validators: Array<ValidatorCallback<T>>
) {
  const value = ref<T>(initialValue)
  const error = ref<string>()
  const validated = ref(false)
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

    if (isValid) error.value = undefined
    validated.value = true

    return isValid
  }
  function addValidator(validator: ValidatorCallback<any>) {
    validators.push(validator)
  }

  return {
    value,
    error,
    validate,
    validated,
    addValidator,
  }
}

export function useValidationForm<
  T extends TFormValidationField,
  Key extends keyof T
>(validationFields: T, options: IValidationFormOptions = {}) {
  function validateAll() {
    let isAllValid = true

    for (let field of Object.values(validationFields)) {
      const v = field.validate()
      if (!v) {
        isAllValid = false
      }
    }

    if (!isAllValid) {
      options.scrollToWhenFailed?.value?.scrollIntoView()
    }

    return isAllValid
  }

  function getErrorRefs() {
    const errors: Record<Key, Ref> = {} as Record<Key, Ref>

    for (let [fieldName, fieldData] of Object.entries(validationFields)) {
      errors[fieldName as Key] = fieldData.error
    }

    return errors
  }

  /** При изменении sourceField будет изменён и targetField */
  function linkFields(sourceFieldKey: Key, targetFieldKey: Key) {
    watch(validationFields[sourceFieldKey].value, () => {
      validationFields[targetFieldKey].validate()
    })
  }

  function getFieldRefs() {
    const fields: Record<Key, Ref> = {} as Record<Key, Ref>

    for (let [fieldName, fieldData] of Object.entries(validationFields)) {
      fields[fieldName as Key] = fieldData.value
    }

    return fields
  }

  return {
    validateAll,
    getErrorRefs,
    fields: validationFields,
    linkFields,
    getFieldRefs,
  }
}
