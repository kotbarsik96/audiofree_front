<template>
  <div class="cart _page">
    <div class="_container">
      <div class="_page-header">
        <BreadCrumbs />
        <h1 class="_page-header__title">Корзина</h1>
      </div>
      <CartList />
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '~/components/Blocks/BreadCrumbs.vue'
import CartList from '~/components/Page/CartPage/CartList.vue'
</script>

<style lang="scss" scoped>
.cart {
  padding-bottom: 4rem;
}
</style>
