<template>
  <div class="catalog _page">
    <div class="_container">
      <div class="catalog__inner">
        <aside class="catalog__sidebar">
          <CatalogFilter />
          <!-- карточка ads -->
        </aside>
        <div class="catalog__page-header" id="">
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
        <div class="catalog__main">
          <div class="catalog__pagination">
            <AFPagination
              v-if="productsData"
              :total="productsData.total"
              :perPage="productsData.per_page"
            />
          </div>
          <div class="catalog__main-body">
            <div class="catalog__cards" ref="cardsListEl">
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
import { ref } from 'vue'
import CatalogFilter from '~/components/Blocks/CatalogFilter.vue'
import BreadCrumbs from '~/components/Blocks/BreadCrumbs.vue'
import AFSelect from '~/components/Blocks/AFSelect.vue'
import ChevronRightIcon from '~/assets/images/icons/chevron-right.svg'
import ProductCard from '~/components/Blocks/Cards/ProductCard.vue'
import AFPagination from '~/components/Blocks/AFPagination.vue'

const route = useRoute()

const cardsListEl = ref<HTMLElement>()

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
const selectShown = ref(false)

const catalogStore = useProductsCatalogStore()
const { products, productsData } = storeToRefs(catalogStore)

watch(
  () => route.query.page,
  () => {
    if (cardsListEl.value) cardsListEl.value.scrollIntoView()
  }
)
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

  &__cards {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    scroll-margin: 150px;
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

    &__cards {
      justify-content: center;
    }
  }
}
</style>
