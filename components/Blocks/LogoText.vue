<template>
  <NuxtLink class="logo-text" to="/" tabindex="0">
    <span class="logo-text__logo">
      <AFIcon v-if="!hideIcon" :icon="HeadphonesIcon" />
      Audiofree
      <span v-if="!hideText">|</span>
    </span>
    <span v-if="!hideText" class="logo-text__text">
      Интернет магазин беспроводных наушников по РФ
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import AFIcon from '~/components/Blocks/AFIcon.vue'
import HeadphonesIcon from '@/assets/images/icons/headphones.svg'

const props = defineProps<{
  hideIcon?: boolean
  hideText?: boolean
}>()
</script>

<style lang="scss" scoped>
.logo-text {
  display: flex;
  align-items: center;
  gap: 5px;

  &__logo {
    display: flex;
    align-items: center;
    gap: 9px;
    transition: var(--general-transition);
    font: var(--text-18);
    font-weight: 700;

    .icon {
      width: 21px;
    }
  }

  &__text {
    font: var(--text-16);
    line-height: 1;
    transition: var(--general-transition);
  }

  &:hover &__logo,
  &:hover &__text {
    color: var(--secondary-2);
  }
}
</style>
