<template>
  <div class="gallery-switcher">
    <div class="gallery-switcher__main">
      <Transition name="blur">
        <img
          class="gallery-switcher__main-img"
          :src="chosenImg"
          :key="chosenImg"
          alt=""
        />
      </Transition>
    </div>
    <ul class="gallery-switcher__gallery">
      <li v-for="img in images" :key="img">
        <button type="button" aria-label="Показать изображение">
          <img
            class="gallery-switcher__gallery-img"
            :src="img"
            alt=""
            @click="chooseImg(img)"
          />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  images: string[]
}>()

const chosenImg = ref(props.images[0] || '')

function chooseImg(src: string) {
  chosenImg.value = src
}
</script>

<style lang="scss" scoped>
.gallery-switcher {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  &__main {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__main-img {
    width: 100%;
    max-width: 430px;
    aspect-ratio: 1;
    object-fit: contain;
  }

  &__gallery {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;

    li {
      width: 5rem;
      height: 5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }
  }

  &__gallery-img {
    width: 3.25rem;
    height: 3.25rem;
    object-fit: contain;
  }
}
</style>
