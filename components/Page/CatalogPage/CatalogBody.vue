<template>
  <div class="catalog-body" ref="el">
    <div class="catalog-body__pagination">
      <AFPagination
        v-if="productsData"
        :total="productsData.total"
        :perPage="productsData.per_page"
      />
    </div>
    <div class="catalog-body__products-wrapper">
      <Transition name="blur">
        <div class="catalog-body__products" :key="productsKey">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :data="product"
          />
        </div>
      </Transition>
    </div>
    <div class="catalog-body__pagination">
      <AFPagination
        v-if="productsData"
        :total="productsData.total"
        :perPage="productsData.per_page"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AFPagination from '~/components/Blocks/AFPagination.vue'
import ProductCard from '~/components/Blocks/Cards/ProductCard.vue'
import { useProductsCatalogStore } from '~/stores/productsCatalogStore'

const route = useRoute()
const currentPage = computed<number>(() => Number(route.query.page) || 0)
let lastPage = currentPage.value

const el = ref<HTMLElement>()

const catalogStore = useProductsCatalogStore()
const { fetchProducts } = catalogStore
const { productsData } = storeToRefs(catalogStore)
await fetchProducts()

const products = computed(() => productsData.value?.data)
const productsKey = computed(() =>
  (products.value || []).map((el) => el.id).join('')
)
watch(currentPage, onPageChange)

function onPageChange(newPage: number) {
  if (newPage === lastPage || !newPage) return

  lastPage = newPage

  fetchProducts()
  if (el.value) el.value.scrollIntoView()
}
</script>

<style lang="scss" scoped>
.catalog-body {
  display: flex;
  flex-direction: column;
  gap: 2.75rem;
  scroll-margin: 150px;
  position: relative;

  &__products-wrapper {
    position: relative;
  }

  &__products {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    flex: 1 1 auto;

    :deep(.product-card) {
      height: auto;
    }

    @include adaptive(tablet-big) {
      justify-content: center;
    }
  }
}
</style>
