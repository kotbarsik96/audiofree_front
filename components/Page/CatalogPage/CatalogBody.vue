<template>
  <div class="catalog-body" ref="el">
    <div class="catalog-body__pagination">
      <AFPagination
        v-if="productsData"
        :total="productsData.total"
        :perPage="productsData.per_page"
        :disabled="disabledPagination"
      />
    </div>
    <div class="catalog-body__products-wrapper">
      <Transition name="blur-relative">
        <div
          v-if="!!products?.length"
          class="catalog-body__products"
          :key="productsKey"
        >
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :data="product"
          />
        </div>
        <EmptyList v-else shown class="catalog-body__empty" icon="empty-box">
          <p>К сожалению, результаты не найдены</p>
          <p>Скорее всего, они появятся при выборе других фильтров</p>
        </EmptyList>
      </Transition>
    </div>
    <div class="catalog-body__pagination">
      <AFPagination
        v-if="productsData"
        :total="productsData.total"
        :perPage="productsData.per_page"
        :disabled="disabledPagination"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AFPagination from '~/components/Blocks/AFPagination.vue'
import ProductCard from '~/components/Blocks/Cards/ProductCard.vue'
import EmptyList from '~/components/Blocks/EmptyList.vue'
import {
  type IInjectCatalog,
} from '~/domain/product/types/IInjectCtalog'
import { CatalogInjection } from '~/enums/injections';

const route = useRoute()
const currentPage = computed<number>(() => Number(route.query.page) || 0)
let lastPage = currentPage.value

const el = ref<HTMLElement>()

const { fetchingProducts, fetchProducts, productsData } =
  injectStrict<IInjectCatalog>(CatalogInjection)
const disabledPagination = computed(
  () => fetchingProducts.value && typeof window !== 'undefined'
)

await fetchProducts()

const products = computed(() => productsData.value?.data)
const productsKey = computed(() =>
  (products.value || []).map((el) => el.id).join('')
)
watch(currentPage, onPageChange)

async function onPageChange(newPage: number) {
  if (newPage === lastPage || !newPage) return

  lastPage = newPage

  await updateProducts()
  if (el.value) el.value.scrollIntoView()
}
async function updateProducts() {
  try {
    await fetchProducts()
  } catch (err) {}
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

  &__empty {
    text-align: center;
  }

  &__products {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    flex: 1 1 auto;

    :deep(.product-card) {
      height: auto;
    }
  }

  @include adaptive(tablet-big) {
    &__products {
      justify-content: center;
      margin: 0 auto;
    }
  }
  @include adaptive(tablet-small) {
    &__products {
      grid-template-columns: repeat(2, 1fr);

      :deep(.product-card) {
        margin: 0 auto;
        width: 100%;
      }
    }
  }

  @include adaptive(phone) {
    &__products {
      grid-template-columns: 1fr;
    }
  }
}
</style>
