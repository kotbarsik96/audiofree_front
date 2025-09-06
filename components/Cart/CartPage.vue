<template>
  <div class="cart _page">
    <div class="_container">
      <div class="_page-header">
        <BreadCrumbs />
        <h1 class="_page-header__title">Корзина</h1>
      </div>
      <CartList is-page />
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '~/components/_UI/BreadCrumbs.vue'
import CartList from '~/components/Cart/Blocks/CartList.vue'

const { setBreadcrumbs } = useBreadcrumbs()
setBreadcrumbs([
  {
    index: 2,
    label: 'Корзина',
    link: { name: 'CartPage' },
  },
])
</script>

<style lang="scss" scoped>
.cart {
  padding-bottom: 4rem;
}
</style>
