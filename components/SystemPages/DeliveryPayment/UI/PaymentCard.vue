<template>
  <div class="payment-card _card">
    <div class="payment-card__inner _card__inner">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.payment-card {
  min-height: 9rem;

  &__inner {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.625rem 2rem;
    height: 100%;
  }

  img,
  svg {
    max-height: 8rem;
  }

  img {
    object-fit: contain;
  }
}
</style>
