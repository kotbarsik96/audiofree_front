<template>
  <div v-if="!!variation && !!product" class="product-body">
    <GalleryWrapper class="product-body__gallery-wrapper" :images="gallery" />
    <BreadCrumbs class="product-body__breadcrumbs" />
    <h1 class="product-body__title _page-header__title">{{ fullName }}</h1>
    <AFRating
      class="product-body__rating"
      :value="product.rating_value || 0"
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
      <div class="product-body__block-title">
        Количество<span v-if="inCart"> (сейчас в корзине)</span>:
      </div>
      <QuantityInput v-model="quantity" :max="variation.quantity" />
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
      <AFButton
        v-if="inCart"
        label="Убрать из корзины"
        :disabled="isLoadingCart"
        @click="deleteItem"
      />
      <AFButton
        v-else
        label="В корзину"
        :disabled="isLoadingCart"
        @click="onToCartClick"
      />
      <AFButton
        label="Купить в 1 клик"
        :disabled="isLoadingCart"
        styleType="secondary"
        @click="buyOneclick"
      />
    </div>
    <div class="product-body__side-top">
      <div class="product-body__side-top-id">
        Артикул:
        <span class="_bold">
          {{ product.id }}
        </span>
      </div>
      <div v-if="inCart" class="product-body__side-top-text">
        <CartIcon class="icon" />
        <div>Товар в корзине</div>
      </div>
      <div class="product-body__side-top-main">
        <div class="product-body__side-top-buttons">
          <ButtonIcon contrast :icon="HeartIcon" />
        </div>
      </div>
    </div>
    <ProductSideInfo class="product-body__side-info" />
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
import ProductSideInfo from '~/components/Blocks/ProductSideInfo.vue'
import CartIcon from '~/assets/images/icons/cart.svg'
import HeartIcon from '~/assets/images/icons/heart.svg'
import type { IProductData } from '~/domain/product/types/IProductData'
import { useCart } from '~/domain/cart/useCart'

const router = useRouter()
const route = useRoute()

const productCollectionsStore = useProductCollectionsStore()
const { cartCollection, favoritesCollection } = storeToRefs(
  productCollectionsStore
)

const { updateQuantity, deleteCartItem } = useCart()
const { addNotification } = useNotifications()

const { data: productData } = await useAPI<{ data: IProductData }>(
  `/product/${route.params.product}/${route.params.variation}`
)
const product = computed(() => productData.value?.data.product)
const variation = computed(() => productData.value?.data.variation)
const gallery = computed(
  () => variation.value?.gallery?.map((obj) => obj.url) || []
)
const fullName = computed(
  () => `${product.value?.name || ''} ${variation.value?.name || ''}`
)
const currentPrice = computed(() => variation.value?.current_price || 0)
const oldPrice = computed(() =>
  variation.value?.price === currentPrice.value ? null : variation.value?.price
)

const isLoadingCart = ref(false)

const inCart = computed(() =>
  cartCollection.value?.find(
    (item) => variation.value && item.variation_id === variation.value?.id
  )
)
const isInFavorites = computed(() =>
  favoritesCollection.value?.some(
    (item) => variation.value && item.variation_id === variation.value?.id
  )
)

const quantity = ref(inCart.value ? inCart.value.quantity : 1)
const { refresh: quantityRefreshCallback } = useDelayedCallback(
  250,
  updateQuantityOnChange
)

watch(quantity, () => {
  if (inCart.value) {
    quantityRefreshCallback()
  }
})

async function onToCartClick() {
  if (!variation.value) return

  isLoadingCart.value = true

  const response = await updateQuantity(quantity.value, variation.value, false)
  if (response.ok && response._data.message) {
    addNotification('success', response._data.message)
  } else if (response._data.message) {
    addNotification('error', response._data.message)
  }

  isLoadingCart.value = false
}
function deleteItem() {
  if (!variation.value) return

  isLoadingCart.value = true
  deleteCartItem(variation.value, false)
  isLoadingCart.value = false
}
function updateQuantityOnChange() {
  if (variation.value) updateQuantity(quantity.value, variation.value, false)
}
async function buyOneclick() {
  if (!variation.value) return

  isLoadingCart.value = true
  await updateQuantity(quantity.value, variation.value, true)

  router.push('/cart?oneclick=1')

  isLoadingCart.value = false
}
</script>

<style lang="scss" scoped>
.product-body {
  display: grid;
  grid-template-columns: 27rem 1fr auto;
  grid-template-rows: repeat(6, auto) 1fr;
  gap: 2rem 2.75rem;
  padding-bottom: 4.5rem;
  border-bottom: 1px solid var(--stroke);
  margin-bottom: 4.5rem;

  &__gallery-wrapper {
    grid-column: 1 / 2;
    grid-row: 1 / -1;
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

  &__side-top {
    grid-column: 3 / 4;
    grid-row: 1 / 3;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__side-top-text {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    @include fontSize(16);

    .icon {
      flex-shrink: 0;
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  &__side-top-main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  &__side-top-buttons {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  &__side-info {
    grid-column: 3 / 4;
    grid-row: 3/ -1;

    :deep(.product-info__section:nth-child(2) .product-info__section-value) {
      .icon {
        color: var(--rating-fill-color);
      }
    }
  }

  @include adaptive(tablet-big) {
    grid-template-columns: 28rem 1fr;
    grid-template-rows: repeat(9, auto);

    &__breadcrumbs {
      grid-column: 1 / -1;
      grid-row: 1 / 2;
    }

    &__gallery-wrapper {
      grid-column: 1 / 2;
      grid-row: 2 / 9;
    }

    &__side-top {
      grid-column: 2 / 3;
      grid-row: 2 / 3;
    }

    &__title {
      grid-column: 2 / 3;
      grid-row: span 1;
    }

    &__rating {
      grid-column: 2 / 3;
      grid-row: span 1;
    }

    &__price {
      grid-column: 2 / 3;
      grid-row: span 1;
    }

    &__quantity {
      grid-column: 2 / 3;
      grid-row: span 1;
    }

    &__variations {
      grid-column: 2 / 3;
      grid-row: span 1;
    }

    &__buttons {
      grid-column: 2 / 3;
      grid-row: span 1;
    }

    &__side-info {
      grid-column: 1 / -1;
      grid-row: 9 / 10;
      max-width: 35rem;
    }
  }

  @include adaptive(tablet-small) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(10, auto);
    width: 100%;
    gap: 1rem;

    &__gallery-wrapper {
      grid-column: 1 / -1;
      grid-row: 2 / 3;
      width: 100%;
      height: 20rem;
      max-width: 30rem;
      margin: 0 auto;

      :deep(.gallery-wrapper__slider) {
        display: block;

        .gallery-slider__img {
          height: 20rem;
        }
      }
      :deep(.gallery-wrapper__switcher) {
        display: none;
      }
    }

    &__side-top {
      grid-column: 1 / -1;
      grid-row: 3 / 4;
    }

    &__title {
      grid-column: 1 / -1;
      grid-row: span 1;
    }

    &__rating {
      grid-column: 1 / -1;
      grid-row: span 1;
    }

    &__price {
      grid-column: 1 / -1;
      grid-row: span 1;
    }

    &__quantity {
      grid-column: 1 / -1;
      grid-row: span 1;
    }

    &__variations {
      grid-column: 1 / -1;
      grid-row: span 1;
    }

    &__buttons {
      grid-column: 1 / -1;
      grid-row: span 1;
    }

    &__side-info {
      grid-column: 1 / -1;
      grid-row: span 1;
    }
  }
}
</style>
