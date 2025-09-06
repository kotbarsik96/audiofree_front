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
import BreadCrumbs from '~/components/_UI/BreadCrumbs.vue'
import GRefundPageInfo from '~/components/SystemPages/GuaranteesRefund/_Blocks/GRefundPageInfo.vue'
import GRefundPageSteps from '~/components/SystemPages/GuaranteesRefund/_Blocks/GRefundPageSteps.vue'
import { guaranteesRefundBreadcrumbs } from '~/domain/breadcrumbs/pages'
import { useBreadcrumbs } from '~/domain/breadcrumbs/useBreadcrumbs'

useBreadcrumbs(guaranteesRefundBreadcrumbs)

const { data } = await useAPI<{ data: IPageSeo }>('page/warranty-returns')
usePageMeta(data)
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
