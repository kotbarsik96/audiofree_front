<template>
  <div class="orders _page">
    <div class="_container">
      <div class="_page-header">
        <BreadCrumbs />
        <h1 class="_page-header__title">Список ваших заказов</h1>
      </div>
      <EmptyList v-if="ordersList.length < 1"> test </EmptyList>
      <div v-else class="list">
        <OrderCard v-for="item in ordersList" :key="item.id" :data="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '~/components/Blocks/BreadCrumbs.vue'
import EmptyList from '~/components/Blocks/EmptyList.vue'
import OrderCard from '~/components/Blocks/Cards/Order/OrderCard.vue'
import type { IOrderListItem } from '~/domain/order/interfaces/IOrderListItem'

const { setBreadcrumbs } = useBreadcrumbs()
setBreadcrumbs([
  {
    index: 2,
    label: 'Ваши заказы',
    link: { name: 'OrdersList' },
  },
])

const { data: ordersData } = await useAPI<{
  data: { list: Array<IOrderListItem> }
}>('/order/list', {
  method: 'GET',
})

const ordersList = computed(() => ordersData.value?.data.list || [])
</script>

<style lang="scss" scoped>
.orders {
  padding: 0 0 3rem 0;

  .list {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
