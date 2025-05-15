import type { FetchResult } from '#app'

export class Auth {
  public static async requestCsrfToken() {
    await $fetch('/sanctum/csrf-cookie', {
      baseURL: import.meta.env.VITE_API_URL,
      credentials: 'include',
    })
  }
  public static async login(
    loginString: string,
    authType: 'password' | 'code',
    passwordOrCode: string,
    errorRef?: Ref<string>
  ) {
    const { closeDialogAndReset } = useAuthStore()
    const { addNotification } = useNotifications()
    const { initApp } = useGlobalStore()
    const { login } = useSanctumAuth()

    let response: FetchResult<any, any> | { status: number }

    try {
      response = (await login({
        login: loginString,
        [authType]: passwordOrCode,
      })) as FetchResult<any, any>

      if (isResponseOk(response.status) || response.ok) {
        closeDialogAndReset()
        if (response.message) addNotification('success', response.message)
        await initApp()
      }
    } catch (e: any) {
      if (e.response?._data?.message && errorRef)
        errorRef.value = e.response._data.message

      response = e.response
    }

    return response ? response : { status: 0 }
  }
  public static async logout() {
    const { addNotification } = useNotifications()
    const { initApp } = useGlobalStore()
    const { logout } = useSanctumAuth()

    let response: FetchResult<any, any> | { status: number }

    try {
      await this.requestCsrfToken()
      response = await logout()

      if (isResponseOk(response.status)) {
        initApp()
        if (response.message) addNotification('info', response.message)
      }
    } catch (e: any) {
      response = e.response
    }

    return response
  }
}
