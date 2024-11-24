<template>
  <div class="cart-list">
    <div v-if="hasCart" class="cart-list__header">
      <div class="cart-list__header-item --name">Название товара:</div>
      <div class="cart-list__header-item --price">Цена за штуку:</div>
      <div class="cart-list__header-item --quantity">Количество:</div>
      <div class="cart-list__header-item --total-price">Сумма:</div>
    </div>
    <div class="cart-list__body" :class="{ '--loading': isLoading }">
      <template v-if="hasCart">
        <TransitionGroup name="fade-in">
          <CartItem
            v-for="item in cart?.data"
            :key="item.id"
            :data="item"
            @deleteItem="onCartDelete"
          />
        </TransitionGroup>
      </template>
      <div v-else-if="!isLoading" class="cart-list__empty">
        <div>Корзина пуста</div>
        <AFButton label="Перейти в каталог" type="nuxt-link" to="/catalog" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AFButton from '~/components/Blocks/AFButton.vue'
import CartItem from '~/components/Page/CartPage/CartItem.vue'
import type ICartItem from '~/domain/cart/ICartItem'

const route = useRoute()

const {
  data: cart,
  status,
  refresh,
} = await useAPI<{ data: ICartItem[] }>('/product/cart', {
  method: 'GET',
  params: {
    is_oneclick: route.query.oneclick ? '1' : '',
  },
  immediate: true,
})

const isLoading = computed(() => status.value === 'pending')
const hasCart = computed(() => !!cart.value?.data?.length)

function onCartDelete() {
  refresh()
}
</script>

<style lang="scss" scoped>
.cart-list {
  display: grid;
  grid-template-columns: 7rem auto auto auto auto auto;

  &__header {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: span 6;
    color: var(--text-color-light);
    font-weight: 500;
    @include fontSize(16);

    .--name {
      grid-column: 2 / 3;
    }
    .--price {
      grid-column: 3 / 4;
    }
    .--quantity {
      grid-column: 4 / 5;
    }
    .--total-price {
      grid-column: 5 / 6;
    }
  }

  &__body {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: subgrid;
    grid-column: span 6;
    gap: 0.625rem;
  }

  &__empty {
    grid-column: 1 / -1;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.625rem;
    font-weight: 500;
    @include fontSize(18);
  }

  @include adaptive(tablet-small) {
    display: flex;
    flex-direction: column;

    &__header {
      display: none;
    }
  }
}
</style>
