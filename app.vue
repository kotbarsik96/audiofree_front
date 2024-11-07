<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="#8b75c8" />
    <NuxtLayout>
      <LayoutWrapper>
        <NuxtPage />
      </LayoutWrapper>
    </NuxtLayout>

    <AuthDialog v-model:shown="dialogShown" />
  </div>
</template>

<script lang="ts" setup>
import { useGlobalStore } from '~/stores/globalStore'
import LayoutWrapper from '~/components/Layout/LayoutWrapper.vue'
import AuthDialog from '~/components/Blocks/Dialog/AuthDialog.vue'

const { dialogShown } = storeToRefs(useAuthStore())

onMounted(() => {
  defineIfFirefox()
})

await useGlobalStore().initApp()

function defineIfFirefox() {
  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox')
  if (isFirefox) document.body.classList.add('firefox')
}
</script>

<style>
@import '~/scss/styles.scss';
</style>
