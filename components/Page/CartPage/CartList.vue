<template>
  <div class="cart-list">
    <div class="cart-list__list-body">
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
              @changeQuantity="onQuantityChange"
            />
          </TransitionGroup>
        </template>
        <EmptyList
          v-else-if="!isLoading"
          shown
          class="cart-list__empty"
          icon="empty-cart"
        >
          <div>Корзина пуста</div>
          <AFButton
            label="Перейти в каталог"
            type="nuxt-link"
            :to="{ name: 'CatalogPage' }"
          />
        </EmptyList>
      </div>
    </div>
    <div v-if="hasCart" class="cart-footer">
      <div class="summary">
        <table>
          <tbody>
            <tr>
              <td>Сумма заказа:</td>
              <td>
                <TextPreloader v-if="isLoading" />
                <template v-else>{{ totalCost }} ₽</template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <AFButton
        class="order-btn --large"
        label="Оформить заказ"
        type="nuxt-link"
        :to="toOrderPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AFButton from '~/components/Blocks/AFButton.vue'
import CartItem from '~/components/Page/CartPage/CartItem.vue'
import EmptyList from '~/components/Blocks/EmptyList.vue'
import TextPreloader from '~/components/Blocks/TextPreloader.vue'
import type ICartItem from '~/domain/product/collections/cart/ICartItem'

const props = defineProps<{
  isPage?: boolean
}>()

const route = useRoute()

const toOrderPage = computed(() => ({
  name: 'NewOrderPage',
  query: { is_oneclick: route.query.oneclick },
}))

const {
  data: cart,
  status,
  refresh,
} = await useAPI<{ data: ICartItem[] }>('/product/cart', {
  method: 'GET',
  credentials: 'include',
  params: {
    is_oneclick: route.query.oneclick,
  },
  immediate: true,
})

if (props.isPage) {
  const { data } = await useAPI<{ data: IPageSeo }>('page/cart')

  const { cartCount } = storeToRefs(useProductCollectionsStore())
  usePageMeta(data, {
    titleReplace: () => ({
      '%:count': cartCount.value ? `(${cartCount.value.toString()}) ` : '',
    }),
  })
}

const isLoading = computed(() => status.value === 'pending')
const hasCart = computed(() => !!cart.value?.data?.length)

const totalCost = computed(() =>
  cart.value?.data
    .reduce(
      (prev, current) =>
        current.variation.current_price * current.quantity + prev,
      0
    )
    .toFixed(2)
)

function onCartDelete() {
  refresh()
}
function onQuantityChange() {
  refresh()
}
</script>

<style lang="scss" scoped>
@use '/scss/mixins.scss';

.cart-list {
  &__list-body {
    display: grid;
    grid-template-columns: 7rem auto auto auto auto auto;
  }

  &__empty {
    :deep(a) {
      margin-top: 1rem;
    }
  }

  &__header {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: span 6;
    color: var(--text-color-light);
    font: var(--text-16);
    font-weight: 500;

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
    font: var(--text-18);
    font-weight: 500;
  }

  @include mixins.adaptive(tablet-small) {
    display: flex;
    flex-direction: column;

    &__header {
      display: none;
    }
  }
}

.cart-footer {
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .summary {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: var(--text-color);
    width: 100%;
    border-bottom: 1px solid var(--input-border-color);
    padding-bottom: 2.25rem;
    margin-bottom: 2.25rem;

    .text-preloader {
      width: 5.25em;
    }

    td:first-child {
      padding-right: 2rem;
      font: var(--text-18);
      font-weight: 700;
    }
    td:last-child {
      font: var(--text-24);
      font-weight: 700;
    }
  }
}
</style>
