<template>
  <div class="order _page">
    <div class="_container">
      <div class="_page-header">
        <BreadCrumbs />
        <h1 class="_page-header__title">Оформление заказа</h1>
      </div>
      <OrderForm v-if="!isCreated" @orderCreated="onCreatedOrder" />
      <SuccessfullyCreatedOrder v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import OrderForm from '~/components/Orders/NewOrder/_Blocks/OrderForm.vue'
import BreadCrumbs from '~/components/_UI/BreadCrumbs.vue'
import SuccessfullyCreatedOrder from '~/components/Orders/NewOrder/_Blocks/SuccessfullyCreatedOrder.vue'

const isCreated = ref(false)

const { updateCollection } = useProductCollectionsStore()

const { setBreadcrumbs } = useBreadcrumbs()
setBreadcrumbs([
  {
    index: 2,
    label: 'Корзина',
    link: { name: 'CartPage' },
  },
  {
    index: 3,
    label: 'Оформление заказа',
    link: { name: 'NewOrderPage' },
  },
])

watch(isCreated, () => {
  window.scrollTo({ top: 0 })
})

function onCreatedOrder() {
  isCreated.value = true
  updateCollection()
}
</script>

<style lang="scss" scoped></style>
