import { useValidationField } from "../useValidation"

export type TFormValidationField = Record<string, ReturnType<typeof useValidationField>>