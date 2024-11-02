<template>
  <div v-if="product" class="product-info">
    <AFTabs class="product-info__tabs">
      <AFTab title="Описание">
        <ProductDescription
          class="product-info__description"
          :description="product.description"
        />
      </AFTab>
      <AFTab title="Характеристики">
        <ProductInfo class="product-info__info" :info="product.info" />
      </AFTab>
    </AFTabs>
    <div class="product-info__spoilers">
      <AFSpoiler>
        <template #head>Описание</template>
        <ProductDescription
          class="product-info__description"
          :description="product.description"
        />
      </AFSpoiler>
      <AFSpoiler>
        <template #head>Характеристики</template>
        <ProductInfo class="product-info__info" :info="product.info" />
      </AFSpoiler>
    </div>
  </div>
</template>

<script setup lang="ts">
import AFTabs from '~/components/Blocks/Tabs/AFTabs.vue'
import AFTab from '~/components/Blocks/Tabs/AFTab.vue'
import AFSpoiler from '~/components/Blocks/AFSpoiler.vue'
import ProductDescription from '~/components/Blocks/ProductDescription.vue'
import ProductInfo from '~/components/Blocks/ProductInfo.vue'
import type { IProductData } from '~/domain/product/types/IProductData'

const route = useRoute()

const { data: productData } = await useAPI<{ data: IProductData }>(
  `/product/${route.params.product}/${route.params.variation}`
)
const product = computed(() => productData.value?.data.product)
</script>

<style lang="scss" scoped>
.product-info {
  &__description {
    padding: 0 50px;
  }

  &__spoilers {
    display: none;
  }

  @include adaptive(tablet-big) {
    &__tabs {
      display: none;
    }

    &__spoilers {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
  }
}
</style>
