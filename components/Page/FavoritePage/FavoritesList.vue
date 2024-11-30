<template>
  <div class="fav-list">
    <ProductVariationCard
      v-for="item in list"
      :key="item.variation_id"
      :data="item"
    />
  </div>
</template>

<script setup lang="ts">
// ДОБАВЬ ПАГИНАЦИЮ И ЛЕНИВУЮ ПОДГРУЗКУ
import ProductVariationCard from '~/components/Blocks/Cards/ProductVariationCard.vue'
import type IVariationProduct from '~/domain/product/types/IVariationProduct'

const props = defineProps<{
  searchString: string
}>()

const { data } = await useAPI<{ data: IVariationProduct[] }>(
  '/product/favorites',
  {
    method: 'GET',
    watch: false,
    query: {
      // sort: '',
      // sort_order: '',
      search: props.searchString,
    },
  }
)

const list = computed(() => data.value?.data || [])
</script>

<style lang="scss" scoped></style>
