import { useUserStore } from '~/stores/userStore'
import { useProductCollectionsStore } from '~/stores/productCollectionsStore'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('global', () => {
  const userStore = useUserStore()
  const productCollectionsStore = useProductCollectionsStore()

  const appInitted = ref(false)

  async function initApp() {
    await Promise.all([
      userStore.getUser(),
      productCollectionsStore.updateCollection(),
    ])

    appInitted.value = true
  }

  return {
    appInitted,
    initApp,
  }
})
