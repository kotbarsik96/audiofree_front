<template>
  <NuxtLink
    class="order-card _card"
    :to="{ name: 'OrderPage', params: { id: data.id } }"
  >
    <div class="_card__inner">
      <div class="order-header">
        <div>
          Заказ от <span>{{ date }}</span>
        </div>
        <div>
          <span>№ {{ data.id }}</span>
        </div>
        <div>
          Стоимость: <span>{{ costString }}</span>
        </div>
      </div>
      <div class="order-body">
        <div>Доставка в {{ deliveryPlacesMap[data.delivery_place] }}</div>
        <div v-if="data.delivery_place === 'pickup_point'">
          Адрес: {{ data.delivery_address }}
        </div>
        <div>
          Статус:
          <OrderStatus :status="data.order_status" />
        </div>
        <AFImage :data="data.image" />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import AFImage from '~/components/Blocks/AFImage.vue'
import OrderStatus from '~/components/Blocks/Cards/Order/OrderStatus.vue'
import type { IOrderListItem } from '~/domain/order/interfaces/IOrderListItem'
import { deliveryPlacesMap } from '~/domain/order/types/TDeliveryPlaces'

const props = defineProps<{
  data: IOrderListItem
}>()

const date = computed(() => formatMonthAndYear(props.data.created_at))
const costString = computed(
  () =>
    `${props.data.total_cost?.toLocaleString() ?? 0} ₽ (${
      props.data.is_paid ? 'Оплачен' : 'Ожидает оплаты'
    })`
)
</script>

<style lang="scss" scoped>
.order-card {
  --padding-y: 0.75rem;
  --padding-x: 0.5rem;

  ._card__inner {
    padding: 0;
  }

  .order-header {
    padding: var(--padding-y) var(--padding-x);
    background: var(--stroke);
    border-radius: var(--border-radius) var(--border-radius) 0 0;

    > div {
      color: var(--text-color);
      font-weight: 500;
      @include fontSize(18);

      > span {
        font-weight: 600;
        @include fontSize(21);
      }
    }
  }
  .order-body {
    padding: var(--padding-y) var(--padding-x);

    > div {
      color: var(--text-color);
      font-weight: 600;
      @include fontSize(18);
    }
  }
  .image {
    display: block;
    margin-top: 1rem;
    object-fit: contain;
    width: 250px;
    height: 250px;
  }
}
</style>
