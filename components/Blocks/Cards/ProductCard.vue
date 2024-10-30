<template>
  <NuxtLink
    class="product-card _card"
    :class="className"
    :to="`/product/${data.id}/${data.first_variation.id}`"
  >
    <div class="product-card__inner _card__inner">
      <div class="product-card__top">
        <div class="product-card__status">
          <AFIcon
            class="product-card__status-icon"
            :icon="CheckmarkCircleIcon"
          />
          <span>{{ statusText }}</span>
        </div>
        <div class="product-card__circle-buttons">
          <ButtonIcon contrast :icon="HeartIcon" />
        </div>
      </div>
      <div class="product-card__img">
        <AFImage :src="data.image.url" />
      </div>
      <div class="product-card__title">
        {{ data.brand.value }} {{ data.name }}
      </div>
      <div class="product-card__rating">
        <AFRating :value="data.rating" />
      </div>
      <div class="product-card__price">от {{ currency(data.min_price) }}</div>
      <div class="product-card__buttons">
        <AFButton label="Купить в 1 клик" />
        <AFButton label="В корзину" styleType="secondary" />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import AFIcon from '~/components/Blocks/AFIcon.vue'
import AFRating from '~/components/Blocks/AFRating.vue'
import CheckmarkCircleIcon from '~/assets/images/icons/checkmark-circle.svg'
import ButtonIcon from '~/components/Blocks/ButtonIcon.vue'
import HeartIcon from '~/assets/images/icons/heart.svg'
import type ICatalogProduct from '~/domain/product/types/ICatalogProduct'
import AFButton from '~/components/Blocks/AFButton.vue'
import AFImage from '~/components/Blocks/AFImage.vue'
import { currency } from '~/utils/numbers'

const props = defineProps<{
  data: ICatalogProduct
}>()

const statusMap: Record<string, any> = {
  active: 'В наличии',
  inactive: 'Нет в наличии',
}

const className = computed(() => [`--status-${props.data.status.value_slug}`])

const statusText = computed(() => statusMap[props.data.status.value_slug])
</script>

<style lang="scss" scoped>
.product-card {
  max-width: 17rem;
  height: 100%;

  &__inner {
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-template-rows: repeat(2, auto) 1fr repeat(2, auto);
    align-items: center;
    justify-content: center;
    padding-bottom: 1.5rem;
    gap: 1.25rem;
    height: 100%;
  }

  &__top {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.625rem;
  }

  &__status {
    display: flex;
    align-items: center;
    padding: 0.375rem;
    border-radius: 14px;
    gap: 0.3rem;
    border: 1px solid var(--stroke);
    @include fontSize(14);
  }

  &__status-icon {
    width: 1rem;
    height: 1rem;
  }
  &.--status-active &__status-icon {
    color: var(--secondary);
  }
  &.--status-inactive &__status-icon {
    color: var(--red);
  }

  &__circle-buttons {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  &__img {
    grid-column: 1 / -1;
    width: 12.5rem;
    aspect-ratio: 1;
    margin: 0 auto;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__title {
    grid-column: 1 / -1;
    @include fontSize(14);
    font-weight: 500;
  }

  &__rating {
    grid-column: 1 / 2;
  }

  &__price {
    grid-column: 2 / 3;
    @include fontSize(18);
    font-weight: 700;
    text-align: right;
  }

  &__buttons {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;

    :deep(.btn) {
      flex: 1 1 auto;
    }
    :deep(.btn__label) {
      @include fontSize(13);
    }
  }

  @include adaptive(tablet-big) {
    max-width: 20rem;
  }
}
</style>
