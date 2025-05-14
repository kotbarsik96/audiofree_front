<template>
  <div class="catalog-body" ref="el">
    <div class="catalog-body__pagination">
      <AFPagination
        v-if="productsData"
        :total="productsData?.total"
        :perPage="productsData?.per_page"
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
import { useRouteQuery } from '@vueuse/router'
import type ICatalogProduct from '~/domain/product/types/ICatalogProduct'
import type IPagination from '~/dataAccess/api/IPagination'

const props = defineProps<{
  productsData: IPagination<ICatalogProduct> | null
  isFetchingProducts?: boolean;
}>()

const emit = defineEmits<{
  (e: 'refetchProducts'): void
}>()

const products = computed(() => props.productsData?.data)
const productsKey = computed(() =>
  (products.value || []).map((el) => el.id).join('')
)

const disabledPagination = computed(
  () => props.isFetchingProducts && typeof window !== 'undefined'
)

const currentPage = useRouteQuery('page', '1', { transform: Number })

const el = ref<HTMLElement>()

watch(currentPage, onPageChange)

function fetchProducts() {
  emit('refetchProducts')
}

async function onPageChange() {
  await fetchProducts()
  if (el.value) el.value.scrollIntoView()
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
