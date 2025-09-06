<template>
  <ul class="breadcrumbs">
    <li v-for="(item, index) in breadcrumbs">
      <NuxtLink
        v-if="index !== breadcrumbs.length - 1"
        class="breadcrumbs__link _link"
        :to="item.link"
        tabindex="0"
      >
        {{ item.title }}
      </NuxtLink>
      <span v-else> {{ item.title }} </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { getBreadcrumbs } from '~/domain/breadcrumbs/useBreadcrumbs'

const breadcrumbs = getBreadcrumbs()
</script>

<style lang="scss" scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  &__link {
    position: relative;
    display: inline-block;
    color: var(--breadcrumbs-color);
    transition: var(--general-transition);
    font: var(--text-16);

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 100%;
      height: 1px;
      background: var(--text-color);
      transition: right 0.3s ease-in-out;
    }
    &::after {
      content: '/';
      display: inline-block;
      margin: 0 0.5rem;
    }

    &:hover {
      color: var(--text-color);

      &::before {
        right: 1rem;
      }
    }
  }
}
</style>
