<template>
  <div v-if="!!variation && !!product" class="product-body">
    <div class="product-body__gallery-wrapper">
      <GalleryWrapper class="product-body__gallery" :images="gallery" />
    </div>
    <div class="product-body__main">
      <BreadCrumbs class="product-body__breadcrumbs" />
      <h1 class="product-body__title">{{ fullName }}</h1>
      <AFRating
        class="product-body__rating"
        :value="productData?.data.rating || 0"
      />
      <div class="product-body__price">
        <div class="product-body__price-current">
          {{ currentPrice }}
        </div>
        <div v-if="oldPrice" class="product-body__price-old">
          {{ oldPrice }}
        </div>
      </div>
      <div v-if="variation.quantity > 0" class="product-body__quantity">
        <QuantityInput v-model="quantity" :max="9" />
      </div>
      <div class="product-body__variations">
        <RadioLink
          v-for="item in product.variations"
          :key="item.id"
          :label="item.name"
          :to="`/product/${product.id}/${item.id}`"
        />
      </div>
      <div class="product-body__buttons">
        <AFButton label="В корзину" />
        <AFButton label="Купить в 1 клик" styleType="secondary" />
      </div>
    </div>
    <div class="product-body__side">
      <div class="product-body__side-top">
        <div v-if="true!" class="product-body__side-top-warning">
          <ExclamationMarkIcon />
          До конца акции осталось:
          <span class="_bold">3 дня</span>
        </div>
        <div class="product-body__side-top-main">
          <div class="product-body__side-top-id">
            Артикул:
            <span class="_bold">
              {{ product.id }}
            </span>
          </div>
          <div class="product-body__side-top-buttons">
            <ButtonIcon contrast :icon="HeartIcon" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '~/components/Blocks/BreadCrumbs.vue'
import GalleryWrapper from '~/components/Blocks/Gallery/GalleryWrapper.vue'
import AFRating from '~/components/Blocks/AFRating.vue'
import QuantityInput from '~/components/Blocks/FormElements/QuantityInput.vue'
import RadioLink from '~/components/Blocks/RadioLink.vue'
import AFButton from '~/components/Blocks/AFButton.vue'
import ExclamationMarkIcon from '~/assets/images/icons/exclamation-mark.svg'
import HeartIcon from '~/assets/images/icons/heart.svg'
import type { IProductData } from '~/domain/product/types/IProductData'

const route = useRoute()

const { data: productData } = await useAPI<{ data: IProductData }>(
  `/product/${route.params.product}/${route.params.variation}`,
  {}
)
const product = computed(() => productData.value?.data.product)
const variation = computed(() => productData.value?.data.variation)
const gallery = computed(
  () => variation.value?.gallery.map((obj) => obj.url) || []
)
const fullName = computed(
  () => `${product.value?.name || ''} ${variation.value?.name || ''}`
)
const currentPrice = computed(() => variation.value?.current_price || 0)
const oldPrice = computed(() =>
  variation.value?.price === currentPrice.value ? null : variation.value?.price
)

const quantity = ref(1)
</script>

<style lang="scss" scoped></style>
