import { useUserStore } from '~/stores/userStore'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('global', () => {
  const userStore = useUserStore()

  const appInitted = ref(false)

  async function initApp() {
    await Promise.all([userStore.getUser()])

    appInitted.value = true
  }

  return {
    appInitted,
    initApp,
  }
})
