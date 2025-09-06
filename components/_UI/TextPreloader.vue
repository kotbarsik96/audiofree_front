<template>
  <div class="text-preloader"></div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.text-preloader {
  display: inline-block;
  border-radius: 5px;
  height: 1em;
  width: 3em;
  background-size: 400% 400%;
  background-image: linear-gradient(90deg, #d6d6d6 0%, #919191 100%);
  background-position: 0 50%;
  animation: preloader 1.25s ease-out infinite;

  @keyframes preloader {
    0% {
      background-position: 0 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }
}
</style>
