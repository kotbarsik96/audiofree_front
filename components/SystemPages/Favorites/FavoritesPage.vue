<template>
  <div class="favorites _page">
    <div class="_container">
      <BreadCrumbs />
      <FavoritesPageMain />
      <!-- FavoritesPageRelated...? -->
    </div>
  </div>
</template>

<script setup lang="ts">
import FavoritesPageMain from '~/components/SystemPages/Favorites/_Blocks/FavoritesPageMain.vue'
import BreadCrumbs from '~/components/_UI/BreadCrumbs.vue'
import { favoritesBreadcrumbs } from '~/domain/breadcrumbs/pages'
import { useBreadcrumbs } from '~/domain/breadcrumbs/useBreadcrumbs'

useBreadcrumbs(favoritesBreadcrumbs)
</script>

<style lang="scss" scoped>
.favorites {
  :deep(.breadcrumbs) {
    margin-bottom: 1.5rem;
  }
}
</style>
