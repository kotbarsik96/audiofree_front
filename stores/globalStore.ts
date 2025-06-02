import { useProductCollectionsStore } from '~/stores/productCollectionsStore'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Auth } from '~/domain/auth/Auth'

export const useGlobalStore = defineStore('global', () => {
  const productCollectionsStore = useProductCollectionsStore()

  const appInitted = ref(false)
  const pageIsLoading = ref(false)

  async function initApp() {
    await Promise.all([
      productCollectionsStore.updateCollection(),
      Auth.loginIfHasQuery(),
    ])

    appInitted.value = true
  }

  return {
    appInitted,
    initApp,
    pageIsLoading,
  }
})
