<template>
  <div class="created-order">
    <CartChecked class="created-icon" />
    <p class="text">Ваш заказ успешно создан</p>
    <AFButton
      label="Перейти на страницу заказов"
      class="--large"
      type="nuxt-link"
      :to="{ name: 'OrdersPage' }"
    />
  </div>
</template>

<script setup lang="ts">
import CartChecked from '~/assets/images/icons/cart-check.svg'
import AFButton from '~/components/Blocks/AFButton.vue'
</script>

<style lang="scss" scoped>
.created-order {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;

  .created-icon {
    width: 5rem;
    height: 5rem;
    color: var(--primary);
  }

  .text {
    margin: 2rem 0;
    font: var(--text-30);
    font-weight: 600;
  }
}
</style>
