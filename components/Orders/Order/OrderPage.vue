<template>
  <div class="order _page">
    <div class="_container">
      <div class="_page-header">
        <BreadCrumbs />
        <h1 v-if="orderData" class="_page-header__title">
          Заказ от {{ formatMonthAndYear(orderData.created_at) }} №
          {{ orderData.id }}
        </h1>
      </div>
      <div v-if="orderData" class="general">
        <div class="_card">
          <div class="_card__inner">
            <div>
              Стоимость:
              <span class="detail">
                {{ orderData.total_cost?.toLocaleString() }} ₽
              </span>
            </div>
            <div>
              Заказ
              <span
                class="detail"
                :class="{
                  '--not-paid': !orderData.is_paid,
                  '--paid': orderData.is_paid,
                }"
              >
                {{ paidString }}
              </span>
            </div>
            <div>
              Место доставки:
              <span class="detail">
                {{ deliveryPlacesMap[orderData.delivery_place] }}
              </span>
              по адресу
              <span class="detail">
                {{ orderData.delivery_address }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="orderData" class="products">
        <h2 class="order-section-title _h2">Товары в заказе:</h2>
        <div class="products-list">
          <OrderProduct
            v-for="product in orderData.products"
            :key="product.id"
            :data="product"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '~/components/_UI/BreadCrumbs.vue'
import OrderProduct from '~/components/Orders/_UI/OrderProduct.vue'
import type { IOrder } from '~/domain/order/interfaces/IOrder'
import { deliveryPlacesMap } from '~/domain/order/types/TDeliveryPlaces'

const route = useRoute()

const { setBreadcrumbs } = useBreadcrumbs()
setBreadcrumbs([
  {
    index: 2,
    label: 'Ваши заказы',
    link: { name: 'OrdersPage' },
  },
  {
    index: 3,
    label: `Заказ № ${route.params.id}`,
    link: { name: 'OrderPage' },
  },
])

const [{ data: order }, { data: pageSeoData }] = await Promise.all([
  useAPI<{ data: IOrder }>(`/order/single/${route.params.id}`, {
    credentials: 'include',
  }),
  useAPI<{ data: IPageSeo }>('page/order'),
])

const orderData = computed(() => order.value?.data)
const paidString = computed(() =>
  orderData.value?.is_paid ? 'оплачен' : 'не оплачен'
)

usePageMeta(pageSeoData)
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.order {
  padding: 0 0 3rem 0;

  .general {
    margin-top: 1.5rem;
    font: var(--text-18);
    font-weight: 500;
  }
  .detail {
    font-weight: 600;

    &.--paid {
      color: var(--secondary);
    }
    &.--not-paid {
      color: var(--red);
    }
  }
  .products {
    margin-top: 3rem;
  }
  .order-section-title {
    margin-bottom: 2rem;
    font-weight: 600;
  }
  .products-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 300px));
    gap: 1rem;
  }

  @include mixins.adaptive(tablet-small) {
    .products-list {
      justify-content: center;
    }
  }
}
</style>
