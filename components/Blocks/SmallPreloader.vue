<template>
  <div class="preloader">
    <AFIcon :icon="HeadphonesIcon" />
  </div>
</template>

<script setup lang="ts">
import AFIcon from '~/components/Blocks/AFIcon.vue'
import HeadphonesIcon from '@/assets/images/icons/headphones.svg'
</script>

<style lang="scss" scoped>
.preloader {
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 3rem;
    height: 3rem;
    animation: preloaderAnim 1s linear infinite alternate;
  }
}

@keyframes preloaderAnim {
  0% {
    color: var(--primary);
  }
  100% {
    color: var(--text-color);
  }
}
</style>
