<template>
  <ul class="breadcrumbs">
    <li v-for="(item, index) in breadCrumbs">
      <NuxtLink
        v-if="index !== breadCrumbs.length - 1"
        class="breadcrumbs__link _link"
        :to="item.link"
        tabindex="0"
      >
        {{ item.label }}
      </NuxtLink>
      <span v-else> {{ item.label }} </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useBreadcrumbs } from '#imports'

const { breadCrumbs } = useBreadcrumbs()

// возможно, сделать "кэш-массив" для хранения крошек на момент ухода со страницы
// а после загрузки страницы заменять содержимое кэш-массива настоящими хлебными крошками
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
    @include fontSize(16);

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
