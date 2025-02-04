<template>
  <div class="catalog _page">
    <div class="_container">
      <div class="catalog__inner">
        <aside class="catalog__sidebar">
          <CatalogFilter :isFetchingProducts="isFetchingProducts" @refetchProducts="refetchProducts" />
          <!-- карточка ads -->
        </aside>
        <div class="catalog__page-header">
          <div class="_page-header">
            <BreadCrumbs />
            <h1 class="_page-header__title">Каталог</h1>
          </div>
          <CatalogSorts
            class="catalog__sorts"
            :isFetchingProducts="isFetchingProducts"
          />
        </div>
        <div class="catalog__main">
          <CatalogBody ref="catalogBodyComponent" @updateLoadingState="onLoadingStateUpdate" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CatalogFilter from '~/components/Blocks/CatalogFilter.vue'
import BreadCrumbs from '~/components/Blocks/BreadCrumbs.vue'
import CatalogBody from '~/components/Page/CatalogPage/CatalogBody.vue'
import CatalogSorts from '~/components/Page/CatalogPage/CatalogSorts.vue'
import { useTemplateRef } from 'vue'

const catalogBodyComponent = useTemplateRef('catalogBodyComponent')

const isFetchingProducts = ref(false)

const { setBreadcrumbs } = useBreadcrumbs()
setBreadcrumbs([
  {
    index: 2,
    label: 'Каталог',
    link: { name: 'CatalogPage' },
  },
])

function onLoadingStateUpdate(value: boolean) {
  isFetchingProducts.value = value
}
function refetchProducts(){
  console.log(catalogBodyComponent.value?.$.exposed.b);
  catalogBodyComponent.value?.fetchProducts()
}
</script>

<style lang="scss" scoped>
.catalog {
  --column-width: 17rem;

  &__inner {
    display: grid;
    grid-template-columns: var(--column-width) 1fr;
    grid-template-rows: auto 1fr;
    gap: 1.25rem 2rem;
    padding-bottom: 5rem;
  }

  &__sidebar {
    grid-row: 1 / -1;
  }

  &__page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    grid-column: 2 / 3;
    grid-row: 1 / 2;

    :deep(.select) {
      width: 100%;
      max-width: 17.5rem;
    }
  }

  &__main {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    display: flex;
    flex-direction: column;
    gap: 2.75rem;
  }

  @include adaptive(tablet-big) {
    &__page-header {
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: -1.25rem;
      gap: 1rem;

      .select {
        margin: 0 auto;
        max-width: 25rem;
      }
    }

    &__inner {
      grid-template-columns: 1fr;
      gap: 2rem;
      padding-bottom: 2rem;
    }

    &__sidebar {
      grid-column: 1 / -1;
      grid-row: span 1;
    }

    &__page-header {
      grid-column: 1 / -1;
      grid-row: 1 / 2;
    }

    &__main {
      grid-column: 1 / -1;
      grid-row: span 1;
    }
  }

  @include adaptive(tablet-big) {
    &__sorts {
      align-self: center;
    }
  }
}
</style>
