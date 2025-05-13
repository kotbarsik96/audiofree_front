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
import type IPagination from '~/dataAccess/api/IPagination'
import type ICatalogProduct from '~/domain/product/types/ICatalogProduct'
import { useRouteQuery } from '@vueuse/router'

const emit = defineEmits<{
  (e: 'updateLoadingState', value: boolean): void
}>()

const route = useRoute()

const urlQuery = computed(() => route.query)

defineExpose({
  refetchProducts
})

const {
  data: productsData,
  execute: fetchProducts,
  status,
} = await useAPI<IPagination<ICatalogProduct>>('/products/catalog', {
  query: urlQuery,
  watch: false,
})

const isFetchingProducts = computed(() => status.value === 'pending')
const products = computed(() => productsData.value?.data)
const productsKey = computed(() =>
  (products.value || []).map((el) => el.id).join('')
)

const disabledPagination = computed(
  () => isFetchingProducts.value && typeof window !== 'undefined'
)

const currentPage = useRouteQuery('page', '1', { transform: Number })

const el = ref<HTMLElement>()

watch(currentPage, onPageChange)
watch(isFetchingProducts, (value) => {
  emit('updateLoadingState', value)
})

async function onPageChange() {
  await fetchProducts()
  if (el.value) el.value.scrollIntoView()
}
async function refetchProducts(){
  await fetchProducts();
}
</script>

<style lang="scss" scoped>
@use '/scss/mixins.scss';

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

  @include mixins.adaptive(tablet-big) {
    &__products {
      justify-content: center;
      margin: 0 auto;
    }
  }
  @include mixins.adaptive(tablet-small) {
    &__products {
      grid-template-columns: repeat(2, 1fr);

      :deep(.product-card) {
        margin: 0 auto;
        width: 100%;
      }
    }
  }

  @include mixins.adaptive(phone) {
    &__products {
      grid-template-columns: 1fr;
    }
  }
}
</style>
