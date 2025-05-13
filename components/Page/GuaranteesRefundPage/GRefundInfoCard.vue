<template>
  <div class="grefund-info-card _card">
    <div class="grefund-info-card__inner _card__inner">
      <component :is="data.icon" class="grefund-info-card__icon"></component>
      <div class="grefund-info-card__title">{{ data.title }}</div>
      <div class="grefund-info-card__detail" v-html="data.detail"></div>
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
@use '/scss/mixins.scss';

.grefund-info-card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 2;

  &__inner {
    display: grid;
    grid-template-columns: 4rem 1fr;
    grid-template-rows: subgrid;
    grid-row: span 2;
    align-items: center;
    padding: 3.5rem 1.25rem 1.25rem 1.25rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    column-gap: 1.25rem;
    height: 100%;
  }

  &__icon {
    width: 4rem;
    height: 4rem;
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  &__title {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    font: var(--text-18);
    font-weight: 700;
  }

  &__detail {
    grid-column: 1 / -1;
    grid-row: 2 / 3;
    margin-top: 1rem;
    font: var(--text-18);
  }
  
  @include mixins.adaptive(phone-big){
    &::before {
      display: none;
    }
  }
}
</style>
