<template>
  <div class="product-description" v-html="description"></div>
</template>

<script setup lang="ts">
const props = defineProps<{
  description: string
}>()
</script>

<style lang="scss" scoped></style>
