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
      :productSlug="productSlug"
      fromCurrentUser
    />
  </div>
</template>

<script setup lang="ts">
import ReviewForm from '~/components/Review/UI/ReviewForm.vue'
import ReviewComment from '~/components/Review/UI/ReviewComment.vue'
import { type IReviewInjection } from '~/domain/reviews/types/IReviewInjection'
import { ReviewInjection } from '~/enums/injections'

const { isWritingReview, currentUserReview, productSlug } =
  injectStrict<IReviewInjection>(ReviewInjection)
</script>

<style lang="scss" scoped>
.user-review {
  &__title {
    font: var(--text-20);
    font-weight: 500;
  }
}
</style>
