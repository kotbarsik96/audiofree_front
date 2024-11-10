<template>
  <ul class="breadcrumbs">
    <li v-for="item in breadcrumbs">
      <NuxtLink
        v-if="item.link"
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
const breadcrumbs = [
  {
    link: '/',
    label: 'Главная',
  },
  {
    label: 'Каталог',
  },
]
</script>

<style lang="scss" scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  &__link {
    display: inline-block;
    color: var(--breadcrumbs-color);
    @include fontSize(16);

    &::after {
      content: '/';
      display: inline-block;
      margin: 0 0.5rem;
    }
  }
}
</style>
