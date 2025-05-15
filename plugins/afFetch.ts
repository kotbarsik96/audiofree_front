import { defineNuxtPlugin } from '#app'
import { AppKeys } from '~/enums/AppKeys'
import { debugError } from '~/utils/general'

export default defineNuxtPlugin((nuxtApp) => {
  const afFetch = $fetch.create({
    baseURL: `${import.meta.env.VITE_API_URL}api/`,
    onRequest({ options }) {
      const token = useCookie(AppKeys.XSRFTOKEN)
      if (token.value) options.headers.set('X-XSRF-TOKEN', token.value)
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
