import type { TValidationError } from './TValidationError'

export type ValidatorCallback<T> = (value: T) => TValidationError | false
