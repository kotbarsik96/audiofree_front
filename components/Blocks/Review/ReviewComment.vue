<template>
  <div class="review-comment">
    <div class="review-comment__head">
      <img
        src="/assets/images/icons/user.svg"
        alt=""
        class="review-comment__avatar"
      />
      <div class="review-comment__username">{{ review.user.name }}</div>
      <div class="review-comment__value">
        <AFRating :value="review.value" />
      </div>
    </div>
    <div class="review-comment__body">
      <div v-if="review.pros" class="review-comment__body-section">
        <div class="review-comment__body-title">Достоинства:</div>
        <div class="review-comment__body-text">{{ review.pros }}</div>
      </div>
      <div v-if="review.cons" class="review-comment__body-section">
        <div class="review-comment__body-title">Недостатки:</div>
        <div class="review-comment__body-text">{{ review.cons }}</div>
      </div>
      <div v-if="review.description" class="review-comment__body-section">
        <div class="review-comment__body-title">Комментарий:</div>
        <div class="review-comment__body-text">{{ review.description }}</div>
      </div>
    </div>
    <div
      v-if="userData && review.user_id === userId"
      class="review-comment__edit-buttons"
    >
      <AFButton label="Редактировать отзыв" />
      <AFButton label="Удалить отзыв" styleType="secondary" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type IReview from '~/domain/reviews/types/IReview'
import AFRating from '~/components/Blocks/AFRating.vue'
import AFButton from '~/components/Blocks/AFButton.vue'

const props = defineProps<{
  review: IReview
}>()

const { user: userData } = storeToRefs(useUserStore())

const userId = computed(() => userData.value?.data.id)
</script>

<style lang="scss" scoped></style>
