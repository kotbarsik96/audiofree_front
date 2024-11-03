<template>
  <div class="product-reviews">
    <ReviewForm class="product-reviews__form" />
    <div class="product-reviews__count">
      Всего отзывов: {{ reviewsData?.data.total }}
    </div>
    <div v-if="reviews.length > 0" class="product-reviews__comments">
      <ReviewComment
        v-for="comment in reviews"
        class="product-reviews__comment"
        :review="comment"
      />
    </div>
    <div v-else class="product-reviews__empty">
      <EmptyBoxIcon class="product-reviews__empty-icon" />
      <p>Отзывов еще нет. Напишите первым!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import EmptyBoxIcon from '~/assets/images/icons/empty-box.svg'
import ReviewForm from '~/components/Blocks/Review/ReviewForm.vue'
import ReviewComment from '~/components/Blocks/Review/ReviewComment.vue'
import type { IProductReview } from '~/domain/product/types/IProductData'
import type IPagination from '~/dataAccess/api/IPagination'

const route = useRoute()

const page = ref(1)

const productId = computed(() => route.params.product)

const { data: reviewsData } = await useAPI<{
  data: IPagination<IProductReview>
}>(`/products/${productId.value}/reviews`, {
  params: {
    page,
  },
  watch: [page],
})

const reviews = computed(() => reviewsData.value?.data.data || [])
</script>

<style lang="scss" scoped>
.product-reviews {
  &__form {
  }

  &__comments {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  &__comment {
  }

  &__empty {
  }

  &__empty-icon {
  }
}
</style>
