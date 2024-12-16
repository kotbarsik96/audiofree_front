<template>
  <div class="grefund-steps">
    <h2 class="_h2 grefund-steps__title">Как оформить возврат?</h2>
    <div class="grefund-steps__list">
      <GRefundStep v-for="step in refundSteps" :key="step">
        {{ step }}
      </GRefundStep>
    </div>
  </div>
</template>

<script setup lang="ts">
import GRefundStep from '~/components/Page/GuaranteesRefundPage/GRefundStep.vue'
import refundSteps from '~/enums/guarantees-refund/refundSteps'
</script>

<style lang="scss" scoped>
.grefund-steps {
  &__title {
    margin-bottom: 1.25rem;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    gap: 2rem;
    counter-reset: refundSteps;
  }

  @include adaptive(phone-big){
    &__list {
      gap: 1rem;
      grid-template-columns: 1fr;
    }
  }
}
</style>
