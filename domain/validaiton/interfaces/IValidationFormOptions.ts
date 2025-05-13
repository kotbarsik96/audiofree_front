export interface IValidationFormOptions {
  /** При провале валидации формы страница проскроллится до элемента scrollToWhenFailed */
  scrollToWhenFailed?: Ref<HTMLElement | undefined>
}