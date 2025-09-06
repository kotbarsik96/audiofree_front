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
import BreadCrumbs from '~/components/_UI/BreadCrumbs.vue'
import DeliveryPaymentCards from '~/components/SystemPages/DeliveryPayment/_UI/DeliveryPaymentCards.vue'
import PaymentMethods from '~/components/SystemPages/DeliveryPayment/_Blocks/PaymentMethods.vue'
import { useBreadcrumbs } from '~/domain/breadcrumbs/useBreadcrumbs'
import { deliveryPaymentBreadcrumbs } from '~/domain/breadcrumbs/pages'

useBreadcrumbs(deliveryPaymentBreadcrumbs)

const { data } = await useAPI<{ data: IPageSeo }>('page/delivery-payment')
usePageMeta(data)
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
