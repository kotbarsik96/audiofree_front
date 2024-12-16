<template>
  <div class="dp-cards">
    <div class="dp-cards__list --info">
      <DPCardInfo
        v-for="item in deliveryPaymentInfo"
        :key="item.title"
        :data="item"
      />
    </div>
    <div class="dp-cards__list --prices">
      <DPCardPrices
        v-for="item in deliveryPaymentPrices"
        :key="item.title"
        :data="item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DPCardInfo from '~/components/Page/DeliveryPaymentPage/DPCardInfo.vue'
import DPCardPrices from '~/components/Page/DeliveryPaymentPage/DPCardPrices.vue'
import deliveryPaymentInfo from '~/enums/delivery-payment/deliveryPaymentInfo'
import deliveryPaymentPrices from '~/enums/delivery-payment/deliveryPaymentPrices'
</script>

<style lang="scss" scoped>
.dp-cards {
  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: 2rem;

    &.--info {
      margin-bottom: 3.75rem;
    }

    &.--prices {
    }
  }
}
</style>
