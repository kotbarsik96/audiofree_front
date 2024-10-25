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
import type IPagination from '~/dataAccess/api/IPagination'
import type ICatalogProduct from '~/domain/product/types/ICatalogProduct'

const route = useRoute()
const currentPage = computed<number>(() => Number(route.query.page))

const el = ref<HTMLElement>()

const urlQuery = computed<Record<string, any>>(() => ({
  ...parseRouteQuery(route.query),
  per_page: 9,
}))

const { data: productsData, execute: fetchProducts } = await useAPI<
  IPagination<ICatalogProduct>
>('/products/catalog', {
  query: urlQuery,
  watch: false,
})
const products = computed(() => productsData.value?.data)
const productsKey = computed(() =>
  (products.value || []).map((el) => el.id).join('')
)
watch(currentPage, onPageChange)

function onPageChange() {
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
