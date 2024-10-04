<template>
  <ul class="breadcrumbs">
    <li v-for="item in breadcrumbs">
      <NuxtLink class="breadcrumbs__link" :to="item.link">
        {{ item.label }}
      </NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps<{
  breadcrumbs: {
    link: string
    label: string
  }[]
}>()
</script>

<style lang="scss" scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  
  &__link {
    color: var(--breadcrumbs-color);
    
  }
}
</style>
