import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { authTabs } from '~/domain/auth/authTabs'
import { type loginTypes } from '~/domain/auth/loginTypes'
import { SignupSteps } from '~/domain/auth/SignupSteps'

export const useAuthStore = defineStore('auth', () => {
  const tab = ref<authTabs>('signup')
  const previousTab = ref<authTabs>('signup')
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const passwordRepeat = ref('')
  const dialogShown = ref(false)
  const isLoading = ref(false)
  const signupStep = ref<SignupSteps>(SignupSteps.ChooseLoginStep)
  const signupLoginType = ref<loginTypes>('Email')
  // const loginStep = ref<LoginSteps>(LoginSteps.___)

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

  return {
    tab,
    previousTab,
    name,
    email,
    password,
    passwordRepeat,
    dialogShown,
    isLoading,
    signupStep,
    signupLoginType,
    goBack,
    openLoginDialog,
    openSignupDialog,
  }
})
