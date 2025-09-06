<template>
  <LogInToSeePage>
    <FavoritesPage />
  </LogInToSeePage>
</template>

<script setup lang="ts">
import LogInToSeePage from '~/components/Auth/_Blocks/LogInToSeePage.vue'
import FavoritesPage from '~/components/SystemPages/Favorites/FavoritesPage.vue'

definePageMeta({
  name: 'FavoritesPage',
})
</script>
