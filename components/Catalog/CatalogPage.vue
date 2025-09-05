<template>
  <div class="catalog _page">
    <div class="_container">
      <div class="catalog__inner">
        <aside class="catalog__sidebar">
          <CatalogFilter
            :isFetchingProducts="isFetchingProducts"
            :filterItems="filterItems"
          />
        </aside>
        <div class="catalog__page-header">
          <div class="_page-header">
            <BreadCrumbs />
            <h1 class="_page-header__title">Каталог</h1>
          </div>
          <CatalogSorts
            class="catalog__sorts"
            :isFetchingProducts="isFetchingProducts"
            :sortsData="sortsData"
          />
        </div>
        <div class="catalog__main" ref="mainEl">
          <CatalogBody
            :productsData="productsData"
            :isFetchingProducts="isFetchingProducts"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CatalogFilter from '~/components/Blocks/CatalogFilter.vue'
import BreadCrumbs from '~/components/Blocks/BreadCrumbs.vue'
import CatalogBody from '~/components/Catalog/Blocks/CatalogBody.vue'
import CatalogSorts from '~/components/Catalog/Blocks/CatalogSorts.vue'
import type ISelectOption from '~/interfaces/components/ISelectOption'
import type { IFilterItem } from '~/domain/product/types/IFilterItem'
import type ICatalogProduct from '~/domain/product/types/ICatalogProduct'
import type IPagination from '~/dataAccess/api/IPagination'

const route = useRoute()
const urlQuery = computed(() => {
  const obj = { ...route.query }

  // преобразовать массивы в строки, объеденив элементы запятой
  for (let [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) obj[key] = value.join(',')
  }

  return obj
})

const mainEl = ref<HTMLElement>()

const { setBreadcrumbs } = useBreadcrumbs()
setBreadcrumbs([
  {
    index: 2,
    label: 'Каталог',
    link: { name: 'CatalogPage' },
  },
])

const [
  { data: sortsData },
  { data: filtersData, execute: refetchFilters },
  { data: productsData, execute: _refetchProducts, status: productsStatus },
  { data: pageSeoData },
] = await Promise.all([
  useAPI<{ data: ISelectOption[] }>('/products/catalog/sorts', {
    watch: false,
  }),
  useAPI<{
    data: IFilterItem[]
  }>('/products/catalog/filters', {
    method: 'GET',
    query: urlQuery,
    watch: false,
  }),
  useAPI<IPagination<ICatalogProduct>>('/products/catalog', {
    query: urlQuery,
    watch: false,
  }),
  useAPI<{ data: IPageSeo }>('page/catalog'),
])
usePageMeta(pageSeoData)

const filterItems = computed(() => filtersData.value?.data || [])

const isFetchingProducts = computed(() => productsStatus.value === 'pending')

provide('refetchFilters', refetchFilters)
provide('refetchProducts', refetchProducts)

watch(
  () => route.query,
  (newQuery, oldQuery) => {
    // перезапрашивать каталог только тогда, когда в route.query изменилось хотя бы одно из представленных полей
    const checkKeys = ['page', 'sort', 'sort_order']
    if (checkKeys.some((key) => newQuery[key] !== oldQuery[key])) {
      refetchProducts()
    }
  }
)

async function refetchProducts() {
  await _refetchProducts()

  if (mainEl.value) mainEl.value.scrollIntoView()
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

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
    z-index: 20;
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
    scroll-margin: 150px;
    position: relative;
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    display: flex;
    flex-direction: column;
    gap: 2.75rem;
    z-index: 10;
  }

  @include mixins.adaptive(tablet-big) {
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

  @include mixins.adaptive(tablet-big) {
    &__sorts {
      align-self: center;
    }
  }
}
</style>
