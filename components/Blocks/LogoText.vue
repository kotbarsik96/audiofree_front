<template>
  <component :is="component" class="logo-text" :class="className" :to="to">
    <span class="logo-text__logo">
      <AFIcon v-if="!hideIcon" :icon="HeadphonesIcon" />
      Audiofree
      <span v-if="!hideText">|</span>
    </span>
    <span v-if="!hideText" class="logo-text__text">
      Интернет магазин беспроводных наушников по РФ
    </span>
  </component>
</template>

<script setup lang="ts">
import AFIcon from "~/components/Blocks/AFIcon.vue"
import HeadphonesIcon from "@/assets/images/icons/headphones.svg"
import { defineNuxtLink } from "#app";
import { computed } from "vue"

const props = defineProps<{
  link?: boolean
  hideIcon?: boolean
  hideText?: boolean
}>()

const component = computed(() => (props.link ? defineNuxtLink({}) : "span"))
const to = computed(() => (props.link ? '/' : null))

const className = computed(() => {
  return {
    "logo-text--link": props.link,
  }
})
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
    @include fBold(18);

    .icon {
      width: 21px;
    }
  }

  &__text {
    @include fRegular(12);
    line-height: 1;
    transition: var(--general-transition);
  }

  &--link:hover &__logo,
  &--link:hover &__text {
    color: var(--secondary-2);
  }
}
</style>
