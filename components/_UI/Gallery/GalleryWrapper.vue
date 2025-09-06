<template>
  <div class="gallery-wrapper">
    <GallerySlider class="gallery-wrapper__slider" :images="images" />
    <GallerySwitcher class="gallery-wrapper__switcher" :images="images" />
  </div>
</template>

<script setup lang="ts">
import GallerySwitcher from '~/components/_UI/Gallery/GallerySwitcher.vue'
import GallerySlider from '~/components/_UI/Gallery/GallerySlider.vue'

const props = defineProps<{
  images: string[]
  showSliderMedia?: string
}>()
</script>

<style lang="scss" scoped>
.gallery-wrapper {
  &__slider {
    display: none;
  }
}
</style>
