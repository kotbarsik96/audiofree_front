export enum SignupSteps {
  ChooseLoginStep = 'choose-login',
  TelegramStep = 'telegram',
  EnterLoginStep = 'enter-login',
}

export const signupFormComponents = {
  [SignupSteps.ChooseLoginStep]: defineAsyncComponent(
    () =>
      import('~/components/Blocks/AuthForms/Signup/Steps/ChooseLoginStep.vue')
  ),
  [SignupSteps.TelegramStep]: defineAsyncComponent(
    () => import('~/components/Blocks/AuthForms/Signup/Steps/TelegramStep.vue')
  ),
  [SignupSteps.EnterLoginStep]: defineAsyncComponent(
    () =>
      import('~/components/Blocks/AuthForms/Signup/Steps/EnterLoginStep.vue')
  ),
}
