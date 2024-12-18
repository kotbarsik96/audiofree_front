<template>
  <div class="user-review">
    <div class="user-review__title">Ваш отзыв:</div>
    <ReviewForm
      v-if="isWritingReview && !!currentUserReview"
      :review="currentUserReview"
    />
    <ReviewComment
      v-else-if="!!currentUserReview"
      class="user-review__review"
      :review="currentUserReview"
      :productId="productId"
      fromCurrentUser
    />
  </div>
</template>

<script setup lang="ts">
import ReviewForm from '~/components/Blocks/Review/ReviewForm.vue'
import ReviewComment from '~/components/Blocks/Review/ReviewComment.vue'
import {
  ReviewInjection,
  type IReviewInjection,
} from '~/domain/reviews/types/IReviewInjection'

const { isWritingReview, currentUserReview, productId } =
  injectStrict<IReviewInjection>(ReviewInjection)
</script>

<style lang="scss" scoped>
.user-review {
  &__title {
    @include fontSize(21);
    font-weight: 500;
  }
}
</style>
