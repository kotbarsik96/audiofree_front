export enum LoginSteps {
  EnterLoginStep = 'enter-login',
  ConfirmationCodeStep = 'confirmation-code',
  PasswordStep = 'password',
}

export const loginFormComponents = {
  [LoginSteps.EnterLoginStep]: defineAsyncComponent(
    () => import('~/components/Auth/Login/_UI/Steps/EnterLoginStep.vue')
  ),
  [LoginSteps.ConfirmationCodeStep]: defineAsyncComponent(
    () =>
      import(
        '~/components/Auth/Login/_UI/Steps/ConfirmationCodeStep.vue'
      )
  ),
  [LoginSteps.PasswordStep]: defineAsyncComponent(
    () => import('~/components/Auth/Login/_UI/Steps/PasswordStep.vue')
  ),
}
