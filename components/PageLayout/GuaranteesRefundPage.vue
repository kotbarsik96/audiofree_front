<template>
  <div class="grefund _page">
    <div class="_container">
      <div class="_page-header">
        <BreadCrumbs />
        <h1 class="_page-header__title _h1">Гарантия и возврат</h1>
      </div>
      <GRefundPageInfo class="grefund__info" />
      <GRefundPageSteps />
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '~/components/Blocks/BreadCrumbs.vue'
import GRefundPageInfo from '~/components/Page/GuaranteesRefundPage/GRefundPageInfo.vue'
import GRefundPageSteps from '~/components/Page/GuaranteesRefundPage/GRefundPageSteps.vue'

const { setBreadcrumbs } = useBreadcrumbs()
setBreadcrumbs([
  {
    index: 2,
    label: 'Гарантия и возврат',
    link: { name: 'GuaranteesRefundPage' },
  },
])
</script>

<style lang="scss" scoped>
.grefund {
  margin-bottom: 3.75rem;

  ._page-header {
    margin-bottom: 2rem;
  }

  &__info {
    margin-bottom: 4rem;
  }
}
</style>
