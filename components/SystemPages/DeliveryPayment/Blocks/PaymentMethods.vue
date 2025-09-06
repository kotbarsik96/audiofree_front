<template>
  <div class="payment-cards">
    <PaymentCard v-for="item in paymentMethods" :key="item.label">
      <AFImage v-if="typeof item.icon === 'string'" :data="item.icon" />
      <component v-else :is="item.icon"></component>
    </PaymentCard>
  </div>
</template>

<script setup lang="ts">
import PaymentCard from '~/components/SystemPages/DeliveryPayment/UI/PaymentCard.vue'
import paymentMethods from '~/enums/delivery-payment/paymentMethods'
import AFImage from '~/components/_UI/AFImage.vue'
</script>

<style lang="scss" scoped>
.payment-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 2rem;
}
</style>
