<template>
  <NuxtLink
    class="product-card product-variation-card _card"
    :class="className"
    :to="`/product/${data.product_id}/${data.variation_id}`"
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
        <AFImage :data="data.image" />
      </div>
      <div class="product-card__title">
        {{ data.full_name }}
      </div>
      <div class="product-card__rating">
        <AFRating :value="data.rating_value" />
      </div>
      <div class="product-card__price">
        <span class="--old"> {{ currency(data.price) }} </span>
        <span> {{ currency(data.current_price) }} </span>
      </div>
      <div v-if="isInCart" class="product-card__in-cart">
        <CartIcon />
        Товар у вас в корзине
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
import CartIcon from '~/assets/images/icons/cart.svg'
import AFImage from '~/components/Blocks/AFImage.vue'
import { currency } from '~/utils/numbers'
import type IVariationProduct from '~/domain/product/types/IVariationProduct'
import { Product } from "~/domain/product/Product"

const props = defineProps<{
  data: IVariationProduct
}>()

const productsCollectionStore = useProductCollectionsStore()
const { collection: productsCollection } = storeToRefs(productsCollectionStore)

const className = computed(() => [`--status-${props.data.status}`])

const statusText = computed(() => Product.statusMap(props.data.status))

const isInCart = computed(() =>
  productsCollection.value?.data.cart.some(
    (item) => item.product_id === props.data.variation_id
  )
)
</script>

<style lang="scss" scoped>
@import '/scss/components/ProductCard/ProductCard';

.product-variation-card {
  .--old {
    text-decoration: line-through;
    opacity: 0.7;
  }
}
</style>
