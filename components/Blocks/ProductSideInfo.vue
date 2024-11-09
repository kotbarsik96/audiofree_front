<template>
  <div class="product-info">
    <div
      v-for="section in items"
      :key="section.title"
      class="product-info__section"
    >
      <div class="product-info__section-title">
        {{ section.title }}
      </div>
      <div class="product-info__section-values">
        <div
          v-for="value in section.values"
          :key="value"
          class="product-info__section-value"
        >
          <CheckmarkIcon class="icon" />
          <span>{{ value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CheckmarkIcon from '~/assets/images/icons/checkmark-circle.svg'

const items = [
  {
    title: 'Доставка:',
    values: ['Санкт-Петербург', 'Ленинградская область', 'Москва'],
  },
  {
    title: 'Наши преимущества:',
    values: ['Гарантия', 'Возврат и обмен', 'Лучшая цена'],
  },
]
</script>

<style lang="scss" scoped>
.product-info {
  border-radius: 8px;
  border: 1px solid var(--stroke);

  &__section {
    padding: 1.5rem;
    border-bottom: 1px solid var(--stroke);

    &:last-child {
      border-bottom: 0px;
    }
  }

  &__section-title {
    @include fontSize(16);
    font-weight: 500;
    color: var(--black);
    margin-bottom: 1.125rem;
  }

  &__section-values {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__section-value {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    @include fontSize(16);

    .icon {
      flex-shrink: 0;
      width: 0.875rem;
      height: 0.875rem;
      color: var(--primary);
    }
  }
}
</style>
