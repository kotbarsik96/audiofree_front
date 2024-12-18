<template>
  <div v-if="options.length > 0" class="catalog-sorts">
    <AFSelect :options="options" v-model="sort" />
    <AFSelect :options="orderOptions" v-model="sortOrder" />
  </div>
</template>

<script setup lang="ts">
import AFSelect from '~/components/Blocks/AFSelect.vue'
import {
  CatalogInject,
  type IInjectCatalog,
} from '~/domain/product/types/IInjectCtalog'
import { useSorts } from '~/domain/product/useSorts'
import type ISelectOption from '~/interfaces/components/ISelectOption'

const { fetchProducts } = injectStrict<IInjectCatalog>(CatalogInject)

const { data } = await useAPI<{ data: ISelectOption[] }>('/products/catalog/sorts')

const { options, orderOptions, sort, sortOrder } = useSorts(data, fetchProducts)
</script>

<style lang="scss" scoped>
.catalog-sorts {
  flex: 1 1 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.625rem;
}
</style>
