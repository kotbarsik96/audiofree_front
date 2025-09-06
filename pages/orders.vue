<template>
  <LogInToSeePage>
    <OrdersListPage />
  </LogInToSeePage>
</template>

<script setup lang="ts">
import OrdersListPage from '~/components/Orders/OrdersList/OrdersListPage.vue'
import LogInToSeePage from '~/components/Auth/_Blocks/LogInToSeePage.vue';

definePageMeta({
  name: 'OrdersPage',
})
</script>

<style lang="scss" scoped></style>
