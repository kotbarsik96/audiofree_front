export class Auth {
  public static async login(
    login: string,
    authType: 'password' | 'code',
    passwordOrCode: string,
    errorRef: Ref<string>
  ) {
    const { closeDialogAndReset } = useAuthStore()
    const { addNotification } = useNotifications()
    const { updateJwt, getUser } = useUserStore()

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
          await getUser()
          if (response._data.message)
            addNotification('success', response._data.message)
        }
      },
      onResponseError({ response }) {
        if (response._data.message) errorRef.value = response._data.message
      },
    })
  }
}
