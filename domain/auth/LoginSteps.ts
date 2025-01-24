export enum LoginSteps {
  EnterLoginStep = 'enter-login',
  ConfirmationCodeStep = 'confirmation-code',
}

export const loginFormComponents = {
  [LoginSteps.EnterLoginStep]: defineAsyncComponent(
    () => 
      import(
        '~/components/Blocks/AuthForms/Login/Steps/EnterLoginStep.vue'
      )
  ),
  [LoginSteps.ConfirmationCodeStep]: defineAsyncComponent(
    () =>
      import(
        '~/components/Blocks/AuthForms/Login/Steps/ConfirmationCodeStep.vue'
      )
  ),
}
