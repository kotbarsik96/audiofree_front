import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { authTabs } from '~/domain/auth/authTabs'
import { LoginSteps } from '~/domain/auth/LoginSteps'
import { type loginTypes } from '~/domain/auth/loginTypes'
import { SignupSteps } from '~/domain/auth/SignupSteps'

export const useAuthStore = defineStore('auth', () => {
  const tab = ref<authTabs>('signup')
  const previousTab = ref<authTabs>('signup')
  const login = ref('')
  const dialogShown = ref(false)
  const signupStep = ref<SignupSteps>(SignupSteps.ChooseLoginStep)
  const signupLoginType = ref<loginTypes>('Email')
  const loginStep = ref<LoginSteps>(LoginSteps.EnterLoginStep)

  watch(tab, (_, prevValue) => (previousTab.value = prevValue))

  function goBack() {
    tab.value = previousTab.value
  }

  function openLoginDialog() {
    tab.value = 'login'
    dialogShown.value = true
  }
  function openSignupDialog() {
    tab.value = 'signup'
    dialogShown.value = true
  }
  function closeDialogAndReset() {
    dialogShown.value = false
    login.value = ''
    loginStep.value = LoginSteps.EnterLoginStep
    signupStep.value = SignupSteps.ChooseLoginStep
  }

  return {
    tab,
    previousTab,
    login,
    dialogShown,
    signupStep,
    signupLoginType,
    loginStep,
    goBack,
    openLoginDialog,
    openSignupDialog,
    closeDialogAndReset,
  }
})
