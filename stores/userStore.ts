import { useNotifications } from '@/composables/useNotifications'
import type IUser from '~/domain/user/types/IUser'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { AppKeys } from '~/enums/AppKeys'

export const useUserStore = defineStore('user', () => {
  const jwt = useCookie(AppKeys.JWT)
  const { $afFetch } = useNuxtApp()
  const { addNotification } = useNotifications()

  const { data: user, execute: getUser } = useAPI<{ data: IUser }>(
    '/profile/user',
    {
      immediate: false,
      watch: false,
    }
  )
  const isAuth = computed(() => !!user.value)

  async function logout() {
    jwt.value = null
    await $afFetch('/logout', {
      method: 'POST',
      onResponse({ response }) {
        addNotification('info', response._data.message)
        user.value = null
      },
    })
  }
  function updateJwt(_jwt: string | null) {
    jwt.value = _jwt
  }

  return {
    jwt,
    user,
    isAuth,
    getUser,
    logout,
    updateJwt,
  }
})
