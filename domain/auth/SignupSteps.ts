export enum SignupSteps {
  ChooseLoginStep = 'choose-login',
  TelegramStep = 'telegram',
  EnterLoginStep = 'enter-login',
}

export const signupFormComponents = {
  [SignupSteps.ChooseLoginStep]: defineAsyncComponent(
    () =>
      import('~/components/Auth/Signup/_UI/Steps/ChooseLoginStep.vue')
  ),
  [SignupSteps.TelegramStep]: defineAsyncComponent(
    () => import('~/components/Auth/Signup/_UI/Steps/TelegramStep.vue')
  ),
  [SignupSteps.EnterLoginStep]: defineAsyncComponent(
    () =>
      import('~/components/Auth/Signup/_UI/Steps/EnterLoginStep.vue')
  ),
}
