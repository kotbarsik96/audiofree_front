<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="#8b75c8" />
    <NuxtLayout>
      <LayoutWrapper>
        <NuxtPage />
      </LayoutWrapper>
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
import { useGlobalStore } from '~/stores/globalStore'
import LayoutWrapper from '~/components/Layout/LayoutWrapper.vue'

const { addBreadcrumb } = useBreadcrumbs()

addBreadcrumb({
  index: 1,
  label: 'Главная',
  link: { name: 'HomePage' }
})

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
