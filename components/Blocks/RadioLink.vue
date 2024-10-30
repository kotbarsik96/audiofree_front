<template>
  <NuxtLink class="radio">
    <span class="radio__circle"></span>
    <span class="radio__label">{{ label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
}>()
</script>

<style lang="scss" scoped>
@import '~/scss/components/_AFRadio';
</style>
