<template>
  <div class="cart-item" :class="className">
    <NuxtLink class="cart-item__img-wrapper" :to="productLink">
      <AFImage class="cart-item__img" :src="firstImg" alt="" />
    </NuxtLink>
    <div class="cart-item__title">
      <NuxtLink :to="productLink">
        {{ data.variation.product.name }} ({{ data.variation.name }})
      </NuxtLink>
    </div>
    <div class="cart-item__price">
      <div class="cart-item__subtitle">Цена за штуку</div>
      <div>{{ currency(data.variation.current_price) }}</div>
    </div>
    <div class="cart-item__quantity">
      <QuantityInput v-model="quantity" />
    </div>
    <div class="cart-item__total-price">
      <div class="cart-item__subtitle">Итого</div>
      <div>{{ currency(totalPrice) }}</div>
    </div>
    <div class="cart-item__delete-button">
      <button type="button" aria-label="Удалить товар" @click="deleteItem">
        <CrossIcon />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import CrossIcon from '~/assets/images/icons/cross.svg'
import AFImage from '~/components/Blocks/AFImage.vue'
import QuantityInput from '~/components/Blocks/FormElements/QuantityInput.vue'
import type ICartItem from '~/domain/cart/ICartItem'

const props = defineProps<{
  data: ICartItem
}>()

const emit = defineEmits<{
  (e: 'deleteItem'): void
}>()

const route = useRoute()

const { $afFetch } = useNuxtApp()
const { addNotification } = useNotifications()

const quantity = ref(props.data.quantity || 0)
const firstImg = computed(() => props.data.variation.image.url)
const totalPrice = computed(
  () => props.data.variation.current_price * quantity.value
)
const isLoading = ref(false)

const className = computed(() => ({
  '--loading': isLoading.value,
}))

const productLink = computed(
  () => `/product/${props.data.variation.product_id}/${props.data.variation_id}`
)

async function deleteItem() {
  isLoading.value = true

  try {
    $afFetch('product/cart/item', {
      method: 'DELETE',
      params: {
        variation_id: props.data.variation_id,
        is_oneclick: route.query.oneclick ? '1' : '',
      },
      onResponse({ response }) {
        if (response._data.message) {
          const severity = response.ok ? 'info' : 'error'
          addNotification(severity, response._data.message)
        }
        if (response.ok) {
          emit('deleteItem')
        }
      },
    })
  } catch (err) {}

  isLoading.value = false
}
</script>

<style lang="scss" scoped>
.cart-item {
  --border-radius: 9px;

  position: relative;
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 6;
  box-shadow: 0px 0px 10px oklch(0 0 0 / 0.1);
  gap: 0.75rem;
  border-radius: var(--border-radius);
  padding: 0.4rem 0.75rem;
  background-color: var(--white);

  &::before {
    content: "";
    inset: 0;
    z-index: 500;
    position: absolute;
    opacity: 0;
    background-color: oklch(0 0 0 / 0.25);
    border-radius: var(--border-radius);
    visibility: hidden;
    transition-property: opacity, visibility;
    transition-duration: 0.25s;
    transition-delay: 0s, 0.25s;
  }

  &.--loading {
    pointer-events: none;

    &::before {
      transition-delay: 0s;
      opacity: 1;
      visibility: visible;
    }
  }

  > * {
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid var(--stroke);
    padding: 0 1.75rem;

    &:last-child {
      border-right: none;
    }
  }

  &__img-wrapper {
    width: 100%;
    padding-left: 0;
    padding-right: 0.75rem;

    :deep(picture) {
      width: 100%;
    }
    :deep(img) {
      object-fit: contain;
      aspect-ratio: 1;
      width: 100%;
    }
  }

  &__title {
    font-weight: 500;
    color: var(--text-color);
    @include fontSize(16);
  }

  &__price,
  &__total-price {
    font-weight: 700;
    color: var(--text-color);
    @include fontSize(18);
  }
  &__delete-button {
    svg {
      color: var(--red);
    }
  }

  &__subtitle {
    display: none;
  }

  @include adaptive(desktop-small) {
    > * {
      padding: 0 0.75rem;
    }
  }
  @include adaptive(tablet-small) {
    grid-template-columns: 6rem auto 1fr 24px;
    grid-template-rows: repeat(3, auto);
    padding: 0.8rem;

    > * {
      padding: 0;
      border-right: 0;
      display: block;
    }

    &__subtitle {
      display: block;
      color: var(--breadcrumbs-color);
      @include fontSize(14);
    }

    &__img-wrapper {
      grid-column: 1 / 2;
      grid-row: 1 / -1;
    }

    &__title {
      grid-column: 2 / 4;
      grid-row: 1 / 2;
    }

    &__price {
      grid-column: 2 / 4;
      grid-row: 2 / 3;
    }

    &__quantity {
      grid-column: 2 / 3;
      grid-row: 3 / 4;
    }

    &__total-price {
      grid-column: 3 / 4;
      grid-row: 3 / 4;
    }

    &__delete-button {
      grid-column: 4 / 5;
      grid-row: 1 / -1;
    }
  }
  @include adaptive(phone) {
    grid-template-columns: 5rem repeat(2, auto) 24px;

    &__img-wrapper {
      grid-row: 1 / 3;
    }

    &__quantity {
      grid-column: 1 / 3;
    }

    &__total-price {
      grid-column: 3 / -1;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }
}
</style>
