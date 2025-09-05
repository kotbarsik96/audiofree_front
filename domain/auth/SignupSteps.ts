export enum SignupSteps {
  ChooseLoginStep = 'choose-login',
  TelegramStep = 'telegram',
  EnterLoginStep = 'enter-login',
}

export const signupFormComponents = {
  [SignupSteps.ChooseLoginStep]: defineAsyncComponent(
    () =>
      import('~/components/Auth/AuthForms/Signup/Steps/ChooseLoginStep.vue')
  ),
  [SignupSteps.TelegramStep]: defineAsyncComponent(
    () => import('~/components/Auth/AuthForms/Signup/Steps/TelegramStep.vue')
  ),
  [SignupSteps.EnterLoginStep]: defineAsyncComponent(
    () =>
      import('~/components/Auth/AuthForms/Signup/Steps/EnterLoginStep.vue')
  ),
}
