<template>
  <div class="dp-card-info _card">
    <div class="dp-card-info__inner _card__inner">
      <div class="dp-card-info__icon">
        <component :is="data.icon" />
      </div>
      <div class="dp-card-info__title">{{ data.title }}</div>
      <div class="dp-card-info__detail" v-html="data.detail"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: {
    icon: any
    title: string
    detail: string
  }
}>()
</script>

<style lang="scss" scoped>
.dp-card-info {
  &::before {
    box-shadow: 0;
  }

  &__inner {
    padding: 2rem 1.5rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    height: 100%;
  }

  &__icon {
    width: 6.5rem;
    height: 6.5rem;
    margin-bottom: 2.75rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--input-border-color);

    svg {
      width: 2.725rem;
      height: 2.725rem;
    }
  }

  &__title {
    margin-bottom: 1.25rem;
    font: var(--text-18);
    font-weight: 500;
  }

  &__detail {
    font: var(--text-14);
    font-weight: 400;
  }
}
</style>
