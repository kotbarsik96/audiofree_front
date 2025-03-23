<template>
  <LogInToSeePage>
    <CartPage />
  </LogInToSeePage>
</template>

<script setup lang="ts">
import LogInToSeePage from '~/components/Blocks/LogInToSeePage.vue'
import CartPage from '~/components/PageLayout/CartPage.vue'

definePageMeta({
  name: 'CartPage'
})
</script>
