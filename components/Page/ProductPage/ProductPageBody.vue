<template>
  <div class="product-body">
    <div class="product-body__gallery-wrapper">
      <GalleryWrapper class="product-body__gallery" :images="images" />
    </div>
    <div class="product-body__main">
      <BreadCrumbs class="product-body__breadcrumbs" />
      <h1 class="product-body__title">{{ product?.name }}</h1>
      <AFRating class="product-body__rating" />
      
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '~/components/Blocks/BreadCrumbs.vue'
import GalleryWrapper from '~/components/Blocks/Gallery/GalleryWrapper.vue'
import type { IProductData } from '~/domain/product/types/IProductData'

const { data: productGeneral } = await useAPI<{ data: IProductData }>(
  '/product',
  {}
)
const product = computed(() => productGeneral.value?.data.product)
const images = computed(
  () => productGeneral.value?.data.images.map((obj) => obj.url) || []
)
</script>

<style lang="scss" scoped></style>
