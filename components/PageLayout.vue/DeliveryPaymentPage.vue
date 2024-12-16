<template>
  <div class="delivery-payment _page">
    <div class="_container">
      <div class="_page-header">
        <BreadCrumbs />
        <h1 class="_page-header__title dp-title">Доставка и оплата</h1>
      </div>
      <div class="delivery-payment__cards-section">
        <DeliveryPaymentCards />
      </div>
      <div class="delivery-payment__payment-section">
        <h2 class="dp-title _h2">Оплата</h2>
        <PaymentMethods />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '~/components/Blocks/BreadCrumbs.vue'
import DeliveryPaymentCards from '~/components/Page/DeliveryPaymentPage/DeliveryPaymentCards.vue'
import PaymentMethods from '~/components/Page/DeliveryPaymentPage/PaymentMethods.vue'
</script>

<style lang="scss" scoped>
.delivery-payment {
  margin-bottom: 4.25rem;

  .dp-title {
    margin-bottom: 2.25rem;
  }

  &__cards-section {
    margin-bottom: 5.25rem;
  }
}
</style>
