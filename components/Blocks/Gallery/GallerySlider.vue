<template>
  <div class="gallery-slider">
    <Swiper>
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

<style lang="scss" scoped>
.gallery-slider {
  &__slide {
  }

  &__img {
    width: 100%;
    max-width: 400px;
    object-fit: contain;
  }
}
</style>
