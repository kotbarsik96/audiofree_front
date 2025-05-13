<template>
  <div class="gallery-slider">
    <Swiper class="gallery-slider__slider">
      <SwiperSlide
        v-for="img in images"
        class="gallery-slider__slide"
        :key="img"
      >
        <img class="gallery-slider__img" :src="img" alt="" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'

const props = defineProps<{
  images: string[]
}>()
</script>

<style>
@import '/scss/plugins/swiper.scss';
@import '/scss/plugins/swiper-effect-flip.scss';
@import '/scss/plugins/swiper-pagination.scss';
</style>

<style lang="scss" scoped>
.gallery-slider {
  &__slider {
    width: 100%;
  }

  &__slide {
    width: 100% !important;
  }

  &__img {
    width: 100%;
    max-width: 400px;
    aspect-ratio: 1;
    object-fit: contain;
  }
}
</style>
