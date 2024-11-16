import { useNotifications } from '@/composables/useNotifications'
import type IUser from '~/domain/user/types/IUser'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { AppKeys } from '~/enums/AppKeys'
import { ServerStatuses } from '~/enums/ServerStatuses'

export const useUserStore = defineStore('user', () => {
  const { addNotification } = useNotifications()
  const route = useRoute()

  const jwt = useCookie(AppKeys.JWT)
  const { $afFetch } = useNuxtApp()

  const userId = computed(() => user.value?.id)

  const {
    data: userData,
    execute: _getUser,
    status,
  } = useAPI<{ data: IUser }>('/profile/user', {
    immediate: false,
    watch: false,
    onResponse() {
      checkPageMetaAuth()
    },
    onResponseError({ response }) {
      if (response.status === ServerStatuses.UNAUTHORIZED) {
        jwt.value = null
      }
    },
  })
  const user = computed<IUser | undefined>(() => userData.value?.data)
  const isAuth = computed(() => !!jwt.value)
  const isLoadingUser = computed(() => status.value === 'pending')

  async function logout() {
    jwt.value = null

    await $afFetch('/logout', {
      method: 'POST',
      onResponse({ response }) {
        addNotification('info', response._data.message)
        userData.value = null
      },
    })

    checkPageMetaAuth()
  }
  async function getUser() {
    if (jwt.value) {
      try {
        await _getUser()
      } catch (err) {}
    }

    checkPageMetaAuth()
  }
  function updateJwt(_jwt: string | null) {
    jwt.value = _jwt
  }
  function checkPageMetaAuth() {
    if (!user.value && route.meta.auth) {
      if (!isLoadingUser.value) navigateTo('/')
    }
  }

  return {
    jwt,
    user,
    userId,
    isAuth,
    getUser,
    logout,
    updateJwt,
  }
})
