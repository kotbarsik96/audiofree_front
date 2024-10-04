<template>
  <ul class="socials-list">
    <li v-for="item in socials" :key="item.title">
      <NuxtLink :href="item.href">
        <component class="socials-list__icon" :is="item.icon" />
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import socials from '@/enums/socials'
</script>

<style lang="scss" scoped>
.socials-list {
  display: flex;
  gap: 9px;

  &__icon {
    @include fontSize(26);
    color: var(--white);
    opacity: 0.5;
  }
}
</style>
