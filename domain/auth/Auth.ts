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

    try {
      const response = (await login({
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
    }
  }
  public static async loginIfHasQuery() {
    const user = useSanctumUser()
    const error = ref('')
    const { addNotification } = useNotifications()

    if (!user.value) {
      const route = useRoute()
      const router = useRouter()
      const { auth_code, auth_login } = route.query

      if (auth_code && auth_login && typeof window !== 'undefined') {
        const newQuery = { ...route.query }
        delete newQuery.auth_code
        delete newQuery.auth_login
        router.replace({ name: route.name })

        await this.login(
          auth_login as string,
          'code',
          auth_code as string,
          error
        )

        if (error.value) addNotification('error', error.value)
      }
    }
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
