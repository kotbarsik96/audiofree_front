<template>
  <div class="schat-user">
    <div class="schat-user__in-development">
      <OperatorIcon class="icon" />
      <p>Чат с технической поддержкой в данный момент в разработке</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import OperatorIcon from '~/assets/images/icons/operator.svg'
</script>

<style lang="scss" scoped>
.schat-user {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__in-development {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    font-weight: 500;
    text-align: center;
    @include fontSize(18);

    .icon {
      width: 5rem;
      height: 5rem;
    }
  }
}
</style>
