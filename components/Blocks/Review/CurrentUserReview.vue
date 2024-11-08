<template>
  <div class="user-review">
    <div class="user-review__title">Ваш отзыв:</div>
    <ReviewForm v-if="isEditing" />
    <ReviewComment
      v-else
      class="user-review__review"
      :review="review"
      :productId="productId"
      @deleteReview="onReviewChange"
      @editReview="editReview"
    />
  </div>
</template>

<script setup lang="ts">
import ReviewForm from '~/components/Blocks/Review/ReviewForm.vue'
import ReviewComment from '~/components/Blocks/Review/ReviewComment.vue'
import type IReview from '~/domain/reviews/types/IReview'

const props = defineProps<{
  review: IReview
  productId?: string | number
}>()

const emit = defineEmits<{
  (e: 'changeReview'): void
}>()

const isEditing = ref(false)

function editReview() {
  isEditing.value = true
}
function onReviewChange() {
  emit('changeReview')
}
</script>

<style lang="scss" scoped>
.user-review {
  &__title {
    @include fontSize(21);
    font-weight: 500;
  }
}
</style>
