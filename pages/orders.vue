<template>
  <LogInToSeePage>
    <OrdersListPage />
  </LogInToSeePage>
</template>

<script setup lang="ts">
import OrdersListPage from '~/components/PageLayout/Order/OrdersListPage.vue'
import LogInToSeePage from '~/components/Blocks/LogInToSeePage.vue';

definePageMeta({
  name: 'OrdersPage',
})
</script>

<style lang="scss" scoped></style>
