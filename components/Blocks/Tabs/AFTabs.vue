<template>
  <div class="tabs">
    <div class="tabs__titles">
      <button
        v-for="title in titles"
        class="tabs__title"
        :class="{ '--active': title === activeTabTitle }"
        :key="title"
        @click="setTitle(title)"
        type="button"
      >
        {{ title }}
      </button>
    </div>
    <div class="tabs__body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'
import { TabTitleInjection } from '~/enums/injections';

const slots = useSlots()

const childComponents = computed(() => slots.default?.() || [])
const titles = computed(() =>
  childComponents.value.map((item) => item.props?.title)
)

const activeTabTitle = ref(titles.value[0] || '')
provide(TabTitleInjection, activeTabTitle)

function setTitle(title: string) {
  activeTabTitle.value = title
}
</script>

<style lang="scss" scoped>
.tabs {
  --border-radius: 9px;

  &__titles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 25px;
    position: relative;
    z-index: 10;
  }

  &__title {
    color: var(--tab-inactive-text);
    font: var(--text-24);
    font-weight: 300;
    background-color: rgba(255, 255, 255, .5);
    text-align: center;
    padding: 20px 30px;
    position: relative;
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    transition-property: font-size, font-weight, color, background-color, box-shadow;
    transition-duration: 0.25s;
    transition-timing-function: ease-in-out;

    &.--active {
      box-shadow: 0px 0px 19px rgba(0, 0, 0, 0.05);
      color: var(--black);
      font-weight: 700;
      background-color: var(--white);
    }

    &::after {
      content: "";
      position: absolute;
      bottom: -10px;
      height: 10px;
      left: 0;
      right: 0;
      background-color: var(--white);
    }
  }

  &__body {
    position: relative;
    z-index: 1;
    padding: 80px 0;
    background-color: var(--white);
    box-shadow: 0px 0px 19px rgba(0, 0, 0, 0.05);

    :deep(.tab[class*='enter-active']) {
      top: auto;
      left: auto;
    }
  }
}
</style>
