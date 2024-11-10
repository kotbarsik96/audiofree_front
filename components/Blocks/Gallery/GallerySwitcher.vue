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
      <li v-for="img in images" :key="img" :class="{ '--active': chosenImg === img }">
        <button type="button" aria-label="Показать изображение" @click="chooseImg(img)">
          <img
            class="gallery-switcher__gallery-img"
            :src="img"
            alt=""
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
  gap: 1.5rem;

  &__main {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    border: 1px solid var(--stroke);
    border-radius: 8px;
  }

  &__main-img {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    max-width: 430px;
    object-fit: contain;
    top: auto;
    left: auto;
  }

  &__gallery {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;

    li {
      width: 4rem;
      height: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      border: 1px solid var(--stroke);
      transition: var(--general-transition);
      
      &.--active {
        border-color: var(--text-color-light);
      }
    }
  }

  &__gallery-img {
    width: 3.25rem;
    height: 3.25rem;
    object-fit: contain;
  }
}
</style>
