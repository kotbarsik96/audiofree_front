<template>
  <div class="review-comment _section-box">
    <div class="review-comment__head">
      <div class="review-comment__avatar">
        <img src="/assets/images/icons/user.svg?url" alt="" />
      </div>
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
      v-if="user && review.user_id === userId"
      class="review-comment__edit-buttons"
    >
      <AFButton
        label="Редактировать отзыв"
        :disabled="isLoading"
        @click="editReview"
      />
      <AFButton
        label="Удалить отзыв"
        styleType="secondary"
        :disabled="isLoading"
        @click="removeReview"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type IReview from '~/domain/reviews/types/IReview'
import AFRating from '~/components/Blocks/AFRating.vue'
import AFButton from '~/components/Blocks/AFButton.vue'
import {
  type IReviewInjection,
  ReviewInjection,
} from '~/domain/reviews/types/IReviewInjection'

const props = defineProps<{
  review: IReview
  productId?: number | string
}>()

const { $afFetch } = useNuxtApp()

const { user, userId } = storeToRefs(useUserStore())
const isLoading = ref(false)

const { updateAllReviews, updateWritingReview } =
  injectStrict<IReviewInjection>(ReviewInjection)
const { addConfirm } = useConfirmation()

const { addNotification } = useNotifications()

async function removeReview() {
  if (!props.productId) return

  const confirmed = await addConfirm({
    title: 'Вы уверены, что хотите удалить отзыв?',
  })
  if (!confirmed) return

  isLoading.value = true

  try {
    await $afFetch('product/rating', {
      method: 'DELETE',
      params: {
        product_id: props.productId,
      },
      async onResponse({ response }) {
        if (response.ok) {
          await updateAllReviews()
          addNotification('success', 'Вы удалили свой отзыв о товаре')
        }
      },
    })
  } catch (err) {}

  isLoading.value = false
}

function editReview() {
  updateWritingReview(true)
}
</script>

<style lang="scss" scoped>
.review-comment {
  --comment-padding: 15px 20px;

  &__head {
    padding: var(--comment-padding);
    display: grid;
    grid-template-columns: 1.25rem 1fr;
    grid-template-rows: repeat(2, auto);
    gap: 0.625rem;
    border-bottom: 1px solid var(--stroke);
  }

  &__avatar {
    grid-column: 1 / 2;
    border-radius: 50%;
    background-color: var(--stroke);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__username {
    grid-column: 2 / 3;
    @include fontSize(16);
    font-weight: 500;
  }

  &__value {
    grid-column: 1 / -1;

    :deep(.rating) {
      .rating__icon {
        width: 1.25rem;
        height: 1.25rem;
      }
    }
  }

  &__body {
    padding: var(--comment-padding);
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__body-section {
    display: flex;
    flex-direction: column;
    gap: 0.325rem;
  }

  &__body-title {
    @include fontSize(21);
    font-weight: 700;
    color: var(--black);
  }

  &__body-text {
    color: var(--text-color);
    @include fontSize(18);
  }

  &__edit-buttons {
    padding: var(--comment-padding);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.625rem;
  }

  @include adaptive(phone) {
    &__edit-buttons {
      .btn {
        width: 100%;
        max-width: 250px;
      }
    }
  }
}
</style>
