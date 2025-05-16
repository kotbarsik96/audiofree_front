<template>
  <LogInToSeePage>
    <NewOrderPage />
  </LogInToSeePage>
</template>

<script setup lang="ts">
import LogInToSeePage from '~/components/Blocks/LogInToSeePage.vue'
import NewOrderPage from '~/components/PageLayout/Order/NewOrderPage.vue'

definePageMeta({
  name: 'NewOrderPage',
})
</script>

<style lang="scss" scoped></style>
