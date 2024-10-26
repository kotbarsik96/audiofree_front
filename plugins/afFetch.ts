import { defineNuxtPlugin } from '#app'
import { AppKeys } from '~/enums/AppKeys'
import { debugError } from '~/utils/general'

export default defineNuxtPlugin((nuxtApp) => {
  const afFetch = $fetch.create({
    baseURL: import.meta.env.VITE_API_URL,
    onRequest({ options }) {
      const token = useCookie(AppKeys.JWT)
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`)
      }
    },
    onResponseError(data) {
      debugError(data, 'error from onResponseError')
    },
  })

  return {
    provide: {
      afFetch,
    },
  }
})
