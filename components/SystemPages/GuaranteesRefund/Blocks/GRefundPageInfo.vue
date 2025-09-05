<template>
  <div class="grefund-info">
    <GRefundInfoCard
      v-for="item in guarantees"
      :key="item.title"
      :data="item"
    />
  </div>
</template>

<script setup lang="ts">
import GRefundInfoCard from '~/components/SystemPages/GuaranteesRefund/UI/GRefundInfoCard.vue'
import guarantees from '~/enums/guarantees-refund/guarantees'
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.grefund-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  grid-template-rows: auto 1fr;
  gap: 2rem;

  @include mixins.adaptive(phone-big){
    gap: 1rem;
  }
}
</style>
