<template>
  <div class="dp-card-prices _card">
    <div class="dp-card-prices__inner _card__inner">
      <div class="dp-card-prices__title">{{ data.title }}</div>
      <div class="dp-card-prices__detail">{{ data.detail }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: {
    title: string
    detail: string
  }
}>()
</script>

<style lang="scss" scoped>
.dp-card-prices {
  &::before {
    box-shadow: 0;
  }

  &__inner {
    border-left: 12px solid var(--primary);
    padding: 3.25rem 1.875rem 2rem 1.875rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    height: 100%;
  }

  &__title {
    color: var(--primary);
    font: var(--text-24);
    line-height: 1.875rem;
    font-weight: 500;
  }

  &__detail {
    font: var(--text-14);
    line-height: 1.875rem;
    font-weight: 500;
  }
}
</style>
