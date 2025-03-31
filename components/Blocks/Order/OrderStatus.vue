<template>
  <span class="order-status" :class="[`--${status}`]">
    {{ orderStatusMap[status] }}
  </span>
</template>

<script setup lang="ts">
import {
  orderStatusMap,
  type TOrderStatus,
} from '~/domain/order/types/TOrderStatus'

const props = defineProps<{
  status: TOrderStatus
}>()
</script>

<style lang="scss" scoped>
.order-status {
  padding: 0.25rem;
  border-radius: 5px;
  color: var(--white);
  display: inline-block;
  @include fontSize(16);

  &.--preparing {
    background-color: #2049a9;
    &::selection {
      background: #bca91e;
    }
  }
  &.--delivering {
    background-color: #19899b;
  }
  &.--awaiting_pickup {
    background-color: #4cc730;
  }
  &.--picked_up {
    background-color: #279a1a;
  }
  &.--cancelled {
    background-color: #ae2727;
  }
}
</style>
