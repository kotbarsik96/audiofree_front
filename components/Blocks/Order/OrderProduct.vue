<template>
  <NuxtLink class="_card --clickable order-product" :to="linkToProduct">
    <div class="_card__inner">
      <div class="info">
        <div>
          {{ data.product_name }}
        </div>
        <div>
          <template v-if="data.product_quantity > 1">
            {{ data.product_price }} ₽ /шт. {{ data.product_total_cost }}
          </template>
          <template v-else>{{ data.product_total_cost.toLocaleString() }} ₽</template>
        </div>
      </div>
      <AFImage :data="data.variation.image" />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import AFImage from '~/components/Blocks/AFImage.vue'
import type { IOrderProduct } from '~/domain/order/interfaces/IOrderProduct'

const props = defineProps<{
  data: IOrderProduct
}>()
const linkToProduct = computed(() => ({
  name: 'ProductPage',
  params: {
    product: props.data.variation.product.slug,
    variation: props.data.variation.slug,
  },
}))
</script>

<style lang="scss" scoped>
.order-product {
  display: inline-block;

  ._card__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }
  .info {
    @include fontSize(18);
    font-weight: 500;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.32rem;
    margin-bottom: 1rem;
  }
  .image {
    :deep(img) {
      display: inline-block;
      width: 200px;
      height: 200px;
      object-fit: contain;
    }
  }
}
</style>
