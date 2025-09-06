<template>
  <NuxtLink class="radio" :tabindex="tabindex">
    <span class="radio__circle"></span>
    <span class="radio__label">{{ label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    tabindex?: '0' | '1' | '-1'
  }>(),
  {
    tabindex: '0',
  }
)
</script>

<style lang="scss" scoped>
@use '~/css/components/AFRadio.scss';
</style>
