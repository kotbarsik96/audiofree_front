<template>
  <div class="order _page">
    <div class="_container">
      <div class="_page-header">
        <BreadCrumbs />
        <h1 class="_page-header__title">Оформление заказа</h1>
      </div>
      <OrderForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import OrderForm from '~/components/Page/OrderPage/NewOrderPage/OrderForm.vue';
import BreadCrumbs from '~/components/Blocks/BreadCrumbs.vue';
</script>

<style lang="scss" scoped></style>
