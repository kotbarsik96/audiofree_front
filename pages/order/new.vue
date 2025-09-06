<template>
  <LogInToSeePage>
    <NewOrderPage />
  </LogInToSeePage>
</template>

<script setup lang="ts">
import LogInToSeePage from '~/components/Auth/_Blocks/LogInToSeePage.vue'
import NewOrderPage from '~/components/Orders/NewOrder/NewOrderPage.vue'

definePageMeta({
  name: 'NewOrderPage',
})
</script>

<style lang="scss" scoped></style>
