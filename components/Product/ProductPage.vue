<template>
  <div class="product _page">
    <div class="_container">
      <ProductPageBody />
    </div>
    <div class="_container">
      <ProductPageInfo />
    </div>
    <div class="_container">
      <ProductPageReviews />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductPageBody from '~/components/Product/Blocks/ProductPageBody.vue'
import ProductPageInfo from '~/components/Product/Blocks/ProductPageInfo.vue'
import ProductPageReviews from '~/components/Product/Blocks/ProductPageReviews.vue'
</script>

<style lang="scss" scoped></style>
