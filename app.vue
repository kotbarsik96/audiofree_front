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

const { setBreadcrumbs } = useBreadcrumbs()

setBreadcrumbs([
  {
    index: 1,
    label: 'Главная',
    link: { name: 'HomePage' },
  },
])

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
@import '/scss/base/reset.scss';
@import '/scss/base/fonts.scss';
@import '/scss/base/transition.scss';
@import '/scss/base/general.scss';
@import '/scss/variables/colors.scss';
@import '/scss/variables/fonts.scss';
@import '/scss/variables/sizes.scss';
@import '/scss/variables/transitions.scss';
</style>
