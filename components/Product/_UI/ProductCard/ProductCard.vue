<template>
  <div class="product-card _card" :class="className">
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
            :active="isInFavorites"
            @click="onFavoritesClick"
          />
        </div>
      </div>
      <NuxtLink class="product-card__img" :to="linkToProduct">
        <AFImage :data="data.image" />
      </NuxtLink>
      <NuxtLink class="product-card__title" :to="linkToProduct">
        {{ data.brand.value }} {{ data.name }}
      </NuxtLink>
      <NuxtLink class="product-card__rating" :to="linkToProduct">
        <AFRating :value="data.rating_value" />
      </NuxtLink>
      <NuxtLink class="product-card__price" :to="linkToProduct">
        от {{ currency(data.min_price) }}
      </NuxtLink>
      <NuxtLink v-if="isInCart" class="product-card__in-cart" :to="linkToProduct">
        <CartIcon />
        Товар у вас в корзине
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import AFIcon from '~/components/_UI/AFIcon.vue'
import AFRating from '~/components/_UI/AFRating.vue'
import CheckmarkCircleIcon from '~/assets/images/icons/checkmark-circle.svg'
import ButtonIcon from '~/components/_UI/ButtonIcon.vue'
import HeartIcon from '~/assets/images/icons/heart.svg'
import type ICatalogProduct from '~/domain/product/types/ICatalogProduct'
import CartIcon from '~/assets/images/icons/cart.svg'
import AFImage from '~/components/_UI/AFImage.vue'
import { currency } from '~/utils/numbers'
import { Product } from '~/domain/product/Product'
import { useFavorites } from '~/domain/product/collections/favorites/useFavorites'

const props = defineProps<{
  data: ICatalogProduct
}>()

const isLoadingFavorites = ref(false)

const productsCollectionStore = useProductCollectionsStore()
const { cartCollection, favoritesCollection } = storeToRefs(
  productsCollectionStore
)
const { addToFavorites, deleteFavoriteByProduct } = useFavorites()

const className = computed(() => [`--status-${props.data.status.value_slug}`])

const linkToProduct = computed(() => ({
  name: 'ProductPage',
  params: {
    product: props.data.slug,
    variation: props.data.first_variation.slug,
  },
}))

const statusText = computed(() =>
  Product.statusMap(props.data.status.value_slug)
)

const isInCart = computed(() =>
  cartCollection.value?.some((item) => item.product_id === props.data.id)
)
const isInFavorites = computed(() =>
  favoritesCollection.value?.some((item) => item.product_id === props.data.id)
)

async function onFavoritesClick() {
  if (isLoadingFavorites.value) return
  isLoadingFavorites.value = true

  await (isInFavorites.value
    ? deleteFavoriteByProduct(props.data.id)
    : addToFavorites(props.data.first_variation.id))

  isLoadingFavorites.value = false
}
</script>

<style lang="scss" scoped>
@use '~/css/components/ProductCard/ProductCard.scss';
</style>
