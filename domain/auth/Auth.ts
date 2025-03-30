export class Auth {
  public static async login(
    login: string,
    authType: 'password' | 'code',
    passwordOrCode: string,
    errorRef: Ref<string>
  ) {
    const { closeDialogAndReset } = useAuthStore()
    const { addNotification } = useNotifications()
    const { updateJwt } = useUserStore()
    const { initApp } = useGlobalStore()

    await useNuxtApp().$afFetch('/login', {
      method: 'POST',
      body: {
        login: login,
        [authType]: passwordOrCode,
      },
      async onResponse({ response }) {
        if (isResponseOk(response.status)) {
          updateJwt(response._data.data.token)
          closeDialogAndReset()
          await nextTick()
          await initApp()
          if (response._data.message)
            addNotification('success', response._data.message)
        }
      },
      onResponseError({ response }) {
        if (response._data.message) errorRef.value = response._data.message
      },
    })
  }
  public static async logout() {
    const userStore = useUserStore()
    const { resetUser, checkPageMetaAuth } = userStore
    const { jwt } = storeToRefs(userStore)
    const { addNotification } = useNotifications()
    const { $afFetch } = useNuxtApp()
    const { initApp } = useGlobalStore()

    jwt.value = null

    await $afFetch('/logout', {
      method: 'POST',
      onResponse({ response }) {
        addNotification('info', response._data.message)
        resetUser()
        initApp()
      },
    })

    checkPageMetaAuth()
  }
}
