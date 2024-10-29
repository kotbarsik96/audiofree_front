<template>
  <GallerySlider v-if="showSlider" :images="images" />
  <GallerySwitcher v-else :images="images" />
</template>

<script setup lang="ts">
import GallerySwitcher from '~/components/Blocks/Gallery/GallerySwitcher.vue'
import GallerySlider from '~/components/Blocks/Gallery/GallerySlider.vue'

const props = withDefaults(
  defineProps<{
    images: string[]
    showSliderMedia?: string
  }>(),
  {
    showSliderMedia: 'max-width: 990px',
  }
)

const { matches: showSlider } = useMatchMedia(props.showSliderMedia)
</script>

<style lang="scss" scoped></style>
