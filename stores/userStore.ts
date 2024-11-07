import { useNotifications } from '@/composables/useNotifications'
import type IUser from '~/domain/user/types/IUser'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { AppKeys } from '~/enums/AppKeys'
import { ServerStatuses } from '~/enums/ServerStatuses'

export const useUserStore = defineStore('user', () => {
  const jwt = useCookie(AppKeys.JWT)
  const { $afFetch } = useNuxtApp()
  const { addNotification } = useNotifications()

  const { data: user, execute: _getUser } = useAPI<{ data: IUser }>(
    '/profile/user',
    {
      immediate: false,
      watch: false,
      onResponseError({ response }) {
        if (response.status === ServerStatuses.UNAUTHORIZED) {
          jwt.value = null
        }
      },
    }
  )
  const isAuth = computed(() => !!jwt.value)

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
  function getUser() {
    if (jwt.value) {
      try {
        _getUser()
      } catch (err) {}
    }
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
