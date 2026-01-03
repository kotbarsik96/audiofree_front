<template>
  <div class="three-dots">
    <span class="three-dots-dot" style="--i: 0"></span>
    <span class="three-dots-dot" style="--i: 1"></span>
    <span class="three-dots-dot" style="--i: 2"></span>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.three-dots {
  display: flex;
  align-items: center;
  gap: 0.25rem;

  .three-dots-dot {
    --duration: 1.5s;

    display: inline-block;
    width: 5px;
    height: auto;
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: var(--primary);
    animation-name: dotAnimation;
    animation-timing-function: ease-in-out;
    animation-duration: var(--duration);
    animation-delay: calc(var(--i) * var(--duration) * 0.1);
    animation-iteration-count: infinite;
    opacity: 0.75;
  }
}

@keyframes dotAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
