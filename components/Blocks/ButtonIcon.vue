<template>
  <component :is="component" class="btn-icon" :class="className" v-bind="attrs">
    <div v-if="badge || badge === 0" class="btn-icon__badge">{{ badge }}</div>
    <AFIcon :icon="icon" />
  </component>
</template>

<script setup lang="ts">
import AFIcon from '~/components/Blocks/AFIcon.vue'
import { computed } from 'vue'
import { defineNuxtLink } from '#app'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'link' | 'router-link' | 'div'
    icon: string | any
    shadow?: boolean
    badge?: string | number
    contrast?: boolean
  }>(),
  {
    type: 'button',
  }
)

const component = computed(() => {
  switch (props.type) {
    case 'button':
    default:
      return 'button'
    case 'link':
      return 'a'
    case 'router-link':
      return defineNuxtLink({})
    case 'div':
      return 'div'
  }
})
const attrs = computed(() => {
  switch (props.type) {
    case 'button':
    default:
      return { type: 'button' }
    case 'router-link':
      return {}
  }
})

const className = computed(() => {
  return { shadow: props.shadow, contrast: props.contrast }
})
</script>

<style lang="scss" scoped>
.btn-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.43rem;
  height: 2.43rem;
  border-radius: 50%;
  background-color: var(--white);
  color: var(--primary-dark);
  transition: var(--general-transition);

  &.contrast {
    background-color: #eeeeee;
  }

  .icon {
    font-size: 1.5rem;
  }

  &.shadow {
    box-shadow: 0 0.31rem 0.975rem rgba(140, 121, 199, 0.3);
  }

  &:not(div):hover {
    background-color: var(--secondary-2);
    color: var(--white);
  }

  &__badge {
    position: absolute;
    top: -0.31rem;
    right: -0.31rem;
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: var(--secondary-3);
    color: var(--white);
    font-size: 0.7rem;
    font-weight: 700;
  }

  @include adaptive(tablet-big) {
    background-color: transparent;
    width: auto;
    height: auto;

    .icon {
      width: 1.75rem;
    }

    &.shadow {
      box-shadow: none;
    }
    &.contrast {
      background-color: transparent;
    }
  }
}
</style>
