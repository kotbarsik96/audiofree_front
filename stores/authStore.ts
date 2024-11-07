import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { authTabs } from '@/enums/auth/authTabs'

export const useAuthStore = defineStore('auth', () => {
  const tab = ref<authTabs>('signup')
  const previousTab = ref<authTabs>('signup')
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const passwordRepeat = ref('')
  const dialogShown = ref(false)
  const isLoading = ref(false)

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
    goBack,
    openLoginDialog,
    openSignupDialog,
  }
})
