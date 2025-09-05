<template>
  <div class="product-card product-variation-card _card" :class="className">
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
          <ButtonIcon
            contrast
            :icon="HeartIcon"
            :disabled="isLoadingFavorites"
            :active="isInFavorites"
            @click="onFavoritesClick"
          />
        </div>
      </div>
      <NuxtLink class="product-card__img" :to="linkToProduct">
        <AFImage :data="data.image" />
      </NuxtLink>
      <NuxtLink class="product-card__title" :to="linkToProduct">
        {{ data.full_name }}
      </NuxtLink>
      <NuxtLink class="product-card__rating" :to="linkToProduct">
        <AFRating :value="data.rating_value" />
      </NuxtLink>
      <NuxtLink
        class="product-card__price product-variation-card__price"
        :to="linkToProduct"
      >
        <span v-if="data.price !== data.current_price" class="--old">
          {{ currency(data.price) }}
        </span>
        <span> {{ currency(data.current_price) }} </span>
      </NuxtLink>
      <NuxtLink
        v-if="isInCart"
        class="product-card__in-cart"
        :to="linkToProduct"
      >
        <CartIcon />
        Товар у вас в корзине
      </NuxtLink>
    </div>
  </div>
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
import { Product } from '~/domain/product/Product'
import { useFavorites } from '~/domain/product/collections/favorites/useFavorites'

const props = defineProps<{
  data: IVariationProduct
}>()

const productsCollectionStore = useProductCollectionsStore()
const { cartCollection, favoritesCollection } = storeToRefs(
  productsCollectionStore
)
const { deleteFavoriteByVariation, addToFavorites } = useFavorites()

const className = computed(() => [`--status-${props.data.status}`])

const statusText = computed(() => Product.statusMap(props.data.status))

const linkToProduct = computed(() => ({
  name: 'ProductPage',
  params: {
    product: props.data.product_slug,
    variation: props.data.variation_slug,
  },
}))

const isLoadingFavorites = ref(false)

const isInCart = computed(() =>
  cartCollection.value?.some(
    (item) => item.product_id === props.data.variation_id
  )
)
const isInFavorites = computed(() =>
  favoritesCollection.value?.some(
    (item) => item.variation_id === props.data.variation_id
  )
)

async function onFavoritesClick() {
  if (isLoadingFavorites.value) return
  isLoadingFavorites.value = true

  await (isInFavorites.value
    ? deleteFavoriteByVariation(props.data.variation_id)
    : addToFavorites(props.data.variation_id))

  isLoadingFavorites.value = false
}
</script>

<style lang="scss" scoped>
@use '~/css/components/ProductCard/ProductCard.scss';

.product-variation-card {
  &__price {
    display: flex;
    gap: 0 0.625rem;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .--old {
    text-decoration: line-through;
    opacity: 0.7;
  }
}
</style>
