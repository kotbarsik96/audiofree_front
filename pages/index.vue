<template>
  <div class="home">
    <BestsellersSliderSection />
  </div>
</template>

<script setup lang="ts">
import BestsellersSliderSection from '~/components/Page/HomePage/BestsellersSliderSection.vue'

const route = useRoute()

onMounted(() => console.log(route.query))
</script>

<style lang="scss" scoped></style>
