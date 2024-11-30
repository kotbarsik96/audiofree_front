<template>
  <div class="favorites _page">
    <div class="_container">
      <FavoriteSorts />
      <FavoritesSearch v-model="searchString" />
      <FavoritesList :searchString="searchString" />
    </div>
  </div>
</template>

<script setup lang="ts">
import FavoriteSorts from '~/components/Page/FavoritePage/FavoriteSorts.vue'
import FavoritesSearch from '~/components/Page/FavoritePage/FavoritesSearch.vue'
import FavoritesList from '~/components/Page/FavoritePage/FavoritesList.vue'

const searchString = ref('')
</script>

<style lang="scss" scoped></style>
