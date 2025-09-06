<template>
  <SearchPage />
</template>

<script setup lang="ts">
import SearchPage from '~/components/Search/SearchPage.vue'

definePageMeta({
  name: 'SearchPage',
})
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
</style>
