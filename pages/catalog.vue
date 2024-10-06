<template>
  <div class="catalog _page">
    <div class="_container">
      <div class="catalog__inner">
        <aside class="catalog__sidebar">
          <CatalogFilter />
          <!-- карточка ads -->
        </aside>
        <div class="catalog__main">
          <div class="catalog__main-header">
            <div class="_page-header">
              <BreadCrumbs />
              <h1 class="_page-header__title">Каталог</h1>
            </div>
            <AFSelect
              :options="options"
              v-model="sortType"
              v-model:shown="selectShown"
            />
          </div>
          <div class="catalog__main-body">
            <div class="catalog__cards">
              <ProductCard
                v-for="product in products"
                :key="product.id"
                :data="product"
              />
            </div>
          </div>
          <div class="catalog__pagination">
            <AFPagination
              v-if="productsData"
              :total="productsData.total"
              :perPage="productsData.per_page"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CatalogFilter from '~/components/Blocks/CatalogFilter.vue'
import BreadCrumbs from '~/components/Blocks/BreadCrumbs.vue'
import AFSelect from '~/components/Blocks/AFSelect.vue'
import ChevronRightIcon from '~/assets/images/icons/chevron-right.svg'
import ProductCard from '~/components/Blocks/Cards/ProductCard.vue'
import AFPagination from '~/components/Blocks/AFPagination.vue'
import type ICatalogProduct from '~/domain/product/types/ICatalogProduct'
import { Product } from '~/domain/product/Product'
import type IPagination from '~/dataAccess/api/IPagination'

const productsService = new Product()

const options = [
  {
    label: 'Цена (возрастание)',
    icon: ChevronRightIcon,
    value: 'price_asc',
    iconRotate: '-90deg',
  },
  {
    label: 'Цена (убывание)',
    icon: ChevronRightIcon,
    value: 'price_desc',
    iconRotate: '90deg',
  },
  {
    label: 'Популярность (возрастание)',
    value: 'popular_desc',
    icon: ChevronRightIcon,
    iconRotate: '-90deg',
  },
  {
    label: 'Популярность(убывание)',
    value: 'popular_asc',
    icon: ChevronRightIcon,
    iconRotate: '90deg',
  },
]
const sortType = ref(options[0].value)

const productsData = ref<IPagination<ICatalogProduct> | null>(null)
const products = computed(() => productsData.value?.data)

const selectShown = ref(false)

const { data } = await productsService.getCatalog()
if (data) productsData.value = data.value
</script>

<style lang="scss" scoped>
.catalog {
  --column-width: 17rem;

  &__inner {
    display: grid;
    grid-template-columns: var(--column-width) 1fr;
    gap: 2rem;
  }

  &__sidebar {
  }

  &__main {
  }

  &__main-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 1.25rem;

    :deep(.select) {
      width: 100%;
      max-width: 17.5rem;
    }
  }

  &__main-body {
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: 1rem;
  }

  &__pagination {
  }

  @include adaptive(tablet-big) {
    &__cards {
    }
  }
}
</style>
