<template>
  <div class="home">
    <BestsellersSliderSection />
  </div>
</template>

<script setup lang="ts">
import BestsellersSliderSection from '~/components/Home/_Blocks/BestsellersSliderSection.vue'

const { data } = await useAPI<{ data: IPageSeo }>('page/home')
usePageMeta(data)
</script>

<style lang="scss" scoped></style>
