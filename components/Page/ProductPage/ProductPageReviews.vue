<template>
  <div class="product-reviews">
    <ReviewForm class="product-reviews__form" />
    <div v-if="reviews.length > 0" class="product-reviews__comments">
      <ReviewComment
        v-for="comment in reviews"
        class="product-reviews__comment"
        :review="comment"
      />
    </div>
    <div v-else class="product-reviews__empty">
      <EmptyBoxIcon class="catalog-body__empty-icon" />
      <p>Отзывов еще нет. Напишите первым!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import EmptyBoxIcon from '~/assets/images/icons/empty-box.svg'
import ReviewForm from '~/components/Blocks/Review/ReviewForm.vue'
import ReviewComment from '~/components/Blocks/Review/ReviewComment.vue'
import type { IProductReview } from '~/domain/product/types/IProductData'

const route = useRoute()

const page = ref(1)

const productId = computed(() => route.params.product)

const { data: reviewsData } = await useAPI<{ data: IProductReview[] }>(
  `/products/${productId}/reviews`,
  {
    params: {
      page,
    },
    watch: [page],
  }
)

const reviews = computed(() => reviewsData.value?.data || [])
</script>

<style lang="scss" scoped></style>
