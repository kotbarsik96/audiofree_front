<template>
  <div v-if="!!variation && !!product" class="product-body">
    <div class="product-body__gallery-wrapper">
      <GalleryWrapper class="product-body__gallery" :images="gallery" />
    </div>
    <BreadCrumbs class="product-body__breadcrumbs" />
    <h1 class="product-body__title _page-header__title">{{ fullName }}</h1>
    <AFRating
      class="product-body__rating"
      :value="productData?.data.rating || 0"
      detailed
    />
    <div class="product-body__price">
      <div class="product-body__price-current">
        {{ currency(currentPrice) }}
      </div>
      <div v-if="oldPrice" class="product-body__price-old">
        {{ currency(oldPrice) }}
      </div>
    </div>
    <div v-if="variation.quantity > 0" class="product-body__quantity">
      <div class="product-body__block-title">Количество:</div>
      <QuantityInput v-model="quantity" :max="9" />
    </div>
    <div class="product-body__variations">
      <div class="product-body__block-title">Вариация:</div>
      <div class="product-body__variations-list">
        <RadioLink
          v-for="item in product.variations"
          :key="item.id"
          :label="item.name"
          :to="`/product/${product.id}/${item.id}`"
        />
      </div>
    </div>
    <div class="product-body__buttons">
      <AFButton label="В корзину" />
      <AFButton label="Купить в 1 клик" styleType="secondary" />
    </div>
    <div class="product-body__side">
      <div class="product-body__side-top">
        <div v-if="true!" class="product-body__side-top-warning">
          <ExclamationMarkIcon class="icon" />
          <div>
            До конца акции осталось:
            <span class="_bold">3 дня</span>
          </div>
        </div>
        <div class="product-body__side-top-main">
          <div class="product-body__side-top-id">
            Артикул:
            <span class="_bold">
              {{ product.id }}
            </span>
          </div>
          <div class="product-body__side-top-buttons">
            <ButtonIcon contrast :icon="HeartIcon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '~/components/Blocks/BreadCrumbs.vue'
import GalleryWrapper from '~/components/Blocks/Gallery/GalleryWrapper.vue'
import AFRating from '~/components/Blocks/AFRating.vue'
import QuantityInput from '~/components/Blocks/FormElements/QuantityInput.vue'
import RadioLink from '~/components/Blocks/RadioLink.vue'
import AFButton from '~/components/Blocks/AFButton.vue'
import ButtonIcon from '~/components/Blocks/ButtonIcon.vue'
import ExclamationMarkIcon from '~/assets/images/icons/exclamation-mark.svg'
import HeartIcon from '~/assets/images/icons/heart.svg'
import type { IProductData } from '~/domain/product/types/IProductData'

const route = useRoute()

const { data: productData } = await useAPI<{ data: IProductData }>(
  `/product/${route.params.product}/${route.params.variation}`,
  {}
)
const product = computed(() => productData.value?.data.product)
const variation = computed(() => productData.value?.data.variation)
const gallery = computed(
  () => variation.value?.gallery.map((obj) => obj.url) || []
)
const fullName = computed(
  () => `${product.value?.name || ''} ${variation.value?.name || ''}`
)
const currentPrice = computed(() => variation.value?.current_price || 0)
const oldPrice = computed(() =>
  variation.value?.price === currentPrice.value ? null : variation.value?.price
)

const quantity = ref(1)
</script>

<style lang="scss" scoped>
.product-body {
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-template-rows: repeat(6, auto) 1fr;
  gap: 2rem 2.75rem;

  &__gallery-wrapper {
    grid-column: 1 / 2;
    grid-row: 1 / -1;
  }

  &__gallery {
    grid-column: 2 / 3;
  }

  &__breadcrumbs {
    grid-column: 2 / 3;
  }

  &__title {
    grid-column: 2 / 3;
  }

  &__block-title {
    @include fontSize(14, 145%);
    font-weight: 500;
    color: var(--black);
  }

  &__rating {
    grid-column: 2 / 3;

    :deep(.rating__icon) {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  &__price {
    grid-column: 2 / 3;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  &__price-current {
    @include fontSize(30);
    font-weight: 700;
  }

  &__price-old {
    text-decoration: line-through;
    color: var(--text-color-light);
    @include fontSize(19);
    font-weight: 300;
  }

  &__quantity {
    grid-column: 2 / 3;
  }

  &__variations {
    grid-column: 2 / 3;

    &-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.875rem;
    }
  }

  &__buttons {
    grid-column: 2 / 3;
    display: flex;
    align-items: center;
    gap: 1rem 1.75rem;
    flex-wrap: wrap;
  }

  &__side {
    grid-row: 1 / -1;
    grid-column: 3 / 4;
  }

  &__side-top {
    display: flex;
    justify-content: space-between;
  }

  &__side-top-warning {
    max-width: 8.75rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;

    .icon {
      flex-shrink: 0;
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  &__side-top-main {
  }

  &__side-top-id {
  }

  &__side-top-buttons {
    
  }
}
</style>
