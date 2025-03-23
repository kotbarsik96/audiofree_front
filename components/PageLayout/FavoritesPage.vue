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
import FavoritesPageMain from '~/components/Page/FavoritesPage/FavoritesPageMain.vue'
import BreadCrumbs from '~/components/Blocks/BreadCrumbs.vue'

const { setBreadcrumbs } = useBreadcrumbs()
setBreadcrumbs([
  {
    index: 2,
    label: 'Избранное',
    link: { name: 'FavoritesPage' },
  },
])
</script>

<style lang="scss" scoped>
.favorites {
  :deep(.breadcrumbs) {
    margin-bottom: 1.5rem;
  }
}
</style>
