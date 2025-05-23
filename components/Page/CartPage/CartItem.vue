<template>
  <div class="cart-item" :class="className">
    <NuxtLink class="cart-item__img-wrapper" :to="productLink">
      <AFImage class="cart-item__img" :data="firstImg" alt="" />
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
      <QuantityInput v-model="quantity" :max="data.variation.quantity" />
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

    <ClientOnly>
      <AFDialog
        v-if="warningDialogText"
        class="cart-item__warning-dialog"
        v-model:shown="warningDialogShown"
      >
        <div
          class="cart-item__warning-dialog-body"
          v-html="warningDialogText"
        ></div>
      </AFDialog>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import CrossIcon from '~/assets/images/icons/cross.svg'
import AFImage from '~/components/Blocks/AFImage.vue'
import QuantityInput from '~/components/Blocks/FormElements/QuantityInput.vue'
import AFDialog from '~/components/Blocks/Dialog/AFDialog.vue'
import { useCart } from '~/domain/product/collections/cart/useCart'
import type ICartItem from '~/domain/product/collections/cart/ICartItem'

const props = defineProps<{
  data: ICartItem
}>()

const emit = defineEmits<{
  (e: 'deleteItem'): void
  (e: 'changeQuantity'): void
}>()

const route = useRoute()

const quantity = ref(props.data.quantity || 0)
const firstImg = computed(() => props.data.variation.image)
const totalPrice = computed(
  () => props.data.variation.current_price * quantity.value
)
const isLoading = ref(false)

const { updateQuantity, deleteCartItem } = useCart()

const className = computed(() => ({
  '--loading': isLoading.value,
}))

const productLink = computed(
  () =>
    `/product/${props.data.variation.product.slug}/${props.data.variation.slug}`
)

const warningDialogText = ref('')
const warningDialogShown = ref(false)

if (quantity.value > props.data.variation.quantity || quantity.value < 1) {
  quantity.value = props.data.variation.quantity
  if (quantity.value < 1) {
    deleteItem()
  } else {
    changeQuantity()
    warningDialogText.value =
      'Обратите внимание! <br /> Количество некоторых товаров в корзине было уменьшено, т.к. их недостаточно на складе'
    warningDialogShown.value = true
  }
}

const { refresh: refreshChangeTimeout } = useDelayedCallback(
  250,
  changeQuantity
)

watch(quantity, refreshChangeTimeout)

watch(warningDialogShown, () => {
  if (!warningDialogShown.value) warningDialogText.value = ''
})

async function deleteItem() {
  isLoading.value = true
  const response = await deleteCartItem(
    props.data.variation,
    !!route.query.oneclick
  )
  if (response?.ok) emit('deleteItem')
  isLoading.value = false
}
async function changeQuantity() {
  isLoading.value = true
  await updateQuantity(
    quantity.value,
    props.data.variation,
    !!route.query.oneclick
  )
  isLoading.value = false
  emit('changeQuantity')
}
</script>

<style lang="scss" scoped>
@use '/scss/mixins.scss';

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
    content: '';
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

  span:last-child {
    display: none;
  }

  > * {
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid var(--stroke);
    padding: 0 1.75rem;

    &:first-child {
      border-left: none;
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
    color: var(--text-color);
    font: var(--text-16);
    font-weight: 500;
  }

  &__price,
  &__total-price {
    color: var(--text-color);
    font: var(--text-18);
    font-weight: 700;
  }
  &__delete-button {
    svg {
      color: var(--red);
    }
  }

  &__subtitle {
    display: none;
  }

  &__warning-dialog {
    max-width: 600px;
    text-align: center;
    padding: 0;
    font: var(--text-18);
    font-weight: 500;
  }

  &__warning-dialog-body {
    padding: 1.25rem 0;
  }

  @include mixins.adaptive(desktop-small) {
    > * {
      padding: 0 0.75rem;
    }
  }
  @include mixins.adaptive(tablet-small) {
    grid-template-columns: 6rem auto 1fr 24px;
    grid-template-rows: repeat(3, auto);
    padding: 0.8rem;

    > * {
      padding: 0;
      border-right: 0;
      border-left: 0;
      display: block;
    }

    &__subtitle {
      display: block;
      color: var(--breadcrumbs-color);
      font: var(--text-14);
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
  @include mixins.adaptive(phone) {
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
