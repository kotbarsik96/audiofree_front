<template>
  <div class="catalog-body">
    <div class="catalog-body__pagination">
      <AFPagination
        v-if="productsData"
        :total="productsData.total"
        :perPage="productsData.per_page"
      />
    </div>
    <div class="catalog-body__products" ref="cardsListEl">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :data="product"
      />
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

const currentPage = computed(() => route.query.page)

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
watch(currentPage, () => fetchProducts())
</script>

<style lang="scss" scoped>
.catalog-body {
  &__products {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    scroll-margin: 150px;
    flex: 1 1 auto;

    @include adaptive(tablet-big) {
      justify-content: center;
    }
  }
}
</style>
