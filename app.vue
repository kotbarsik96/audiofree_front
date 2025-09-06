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
import LayoutWrapper from '~/components/_Layout/LayoutWrapper.vue'
import { useBreadcrumbs } from '~/domain/breadcrumbs/useBreadcrumbs'
import { homeBreadcrumbs } from '~/domain/breadcrumbs/pages'

useBreadcrumbs(homeBreadcrumbs)

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
@import '/css/base/reset.scss';
@import '/css/base/fonts.scss';
@import '/css/base/transition.scss';
@import '/css/base/general.scss';
@import '/css/variables/colors.scss';
@import '/css/variables/fonts.scss';
@import '/css/variables/sizes.scss';
@import '/css/variables/transitions.scss';
</style>
