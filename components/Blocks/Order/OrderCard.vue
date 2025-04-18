<template>
  <NuxtLink
    class="order-card _card --clickable"
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
        <div class="texts">
          <div>
            Доставка в
            <span class="detail">
              {{ deliveryPlacesMap[data.delivery_place] }}
            </span>
          </div>
          <div v-if="data.delivery_place === 'pickup_point'">
            Адрес: <span class="detail">{{ data.delivery_address }}</span>
          </div>
          <div>
            Статус:
            <OrderStatus :status="data.order_status" />
          </div>
        </div>
        <AFImage :data="data.image" />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import AFImage from '~/components/Blocks/AFImage.vue'
import OrderStatus from '~/components/Blocks/Order/OrderStatus.vue';
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
  --padding-x: 1rem;

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
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;

    .texts {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 0;
      overflow-wrap: break-word;
    }

    .detail {
      font-weight: 600;
      @include fontSize(21);
    }
  }
  .order-body .texts > div {
    color: var(--text-color);
    font-weight: 500;
    min-width: 0;
    @include fontSize(18);
  }
  .image {
    display: block;
    margin-top: 1rem;
    object-fit: contain;
    width: 150px;
    height: 150px;
    flex-shrink: 0;
  }

  @include adaptive(phone-big) {
    .order-body {
      display: block;
    }
  }
}
</style>
