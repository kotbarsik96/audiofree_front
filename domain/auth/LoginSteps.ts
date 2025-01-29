export enum LoginSteps {
  EnterLoginStep = 'enter-login',
  ConfirmationCodeStep = 'confirmation-code',
  PasswordStep = 'password',
}

export const loginFormComponents = {
  [LoginSteps.EnterLoginStep]: defineAsyncComponent(
    () => import('~/components/Blocks/AuthForms/Login/Steps/EnterLoginStep.vue')
  ),
  [LoginSteps.ConfirmationCodeStep]: defineAsyncComponent(
    () =>
      import(
        '~/components/Blocks/AuthForms/Login/Steps/ConfirmationCodeStep.vue'
      )
  ),
  [LoginSteps.PasswordStep]: defineAsyncComponent(
    () => import('~/components/Blocks/AuthForms/Login/Steps/PasswordStep.vue')
  ),
}
