<template>
  <NewOrderPage />
</template>

<script setup lang="ts">
import NewOrderPage from '~/components/PageLayout/Order/NewOrderPage.vue'

definePageMeta({
  name: 'NewOrderPage',
  auth: true
})
</script>

<style lang="scss" scoped></style>
