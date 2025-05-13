<template>
  <div class="product-reviews">
    <EmptyList :shown="noReviews" class="product-reviews__empty" icon="chat">
      <p>Отзывов еще нет. Напишите первым!</p>
    </EmptyList>
    <ReviewForm
      v-if="!currentUserReview"
      :isWriting="true"
      class="product-reviews__form"
    />
    <div v-if="reviewsData?.total" class="product-reviews__count">
      Всего отзывов:
      <span>{{ reviewsData?.total }}</span>
    </div>
    <div class="product-reviews__comments">
      <CurrentUserReview
        v-if="currentUserReview"
        :review="currentUserReview"
        :productSlug="productSlug"
      />
      <TransitionGroup v-if="!noReviews" name="blur">
        <ReviewComment
          v-for="comment in otherUsersReviews"
          :key="comment.id"
          class="product-reviews__comment"
          :review="comment"
          :productSlug="productSlug"
        />
      </TransitionGroup>
      <div v-if="isLoadingReviews" class="product-reviews__loading-more">
        <SmallPreloader />
        <div>Загружаем еще отзывы...</div>
      </div>
    </div>
    <div class="product-reviews__intersection-el" ref="intersectionEl"></div>
  </div>
</template>

<script setup lang="ts">
import EmptyList from '~/components/Blocks/EmptyList.vue'
import ReviewForm from '~/components/Blocks/Review/ReviewForm.vue'
import ReviewComment from '~/components/Blocks/Review/ReviewComment.vue'
import SmallPreloader from '~/components/Blocks/SmallPreloader.vue'
import CurrentUserReview from '~/components/Blocks/Review/CurrentUserReview.vue'
import type { IProductReview } from '~/domain/product/types/IProductData'
import {
  type IReviewInjection,
} from '~/domain/reviews/types/IReviewInjection'
import { ReviewInjection } from '~/enums/injections'

const { userId } = storeToRefs(useUserStore())
const route = useRoute()

const intersectionEl = ref<HTMLElement>()

const productSlug = computed(() => route.params.product as string)
const page = ref(1)
const isUpdatingReviews = ref(false)

const isWritingReview = ref(false)
const isEditingReview = computed(
  () => isWritingReview.value && !!currentUserReview.value
)

// подготовка запроса отзыва от текущего пользователя
const { data: currentUserReviewData, execute: loadUserReview } = useAPI<{
  data: IProductReview | null
}>(`/product/${productSlug.value}/user-review`, {
  watch: false,
  immediate: false,
})
const currentUserReview = computed(() => currentUserReviewData.value?.data)
const noReviews = computed(
  () => !reviews.value.length && !currentUserReview.value
)

// запрос всех отзывов + запрос отзыва от текущего пользователя
const [
  {
    list: reviews,
    paginationData: reviewsData,
    isLoading: isLoadingReviews,
    refresh: loadReviews,
  },
] = await Promise.all([
  usePaginationLazyWrapper<IProductReview>(
    intersectionEl,
    `/products/${productSlug.value}/reviews`,
    {
      query: {
        page,
        per_page: 5,
      },
    }
  ),
  loadUserReview(),
])
const otherUsersReviews = computed(() =>
  reviews.value.filter((review) => review.user_id !== userId.value)
)

watch(userId, async () => {
  await loadUserReview()
})

provide<IReviewInjection>(ReviewInjection, {
  currentUserReview,
  productSlug,
  isWritingReview,
  isEditingReview,
  updateAllReviews,
  loadReviews,
  loadUserReview,
  updateWritingReview,
})

async function updateAllReviews() {
  isUpdatingReviews.value = true
  await loadReviews()
  await loadUserReview()
  isUpdatingReviews.value = false
}
function updateWritingReview(value: boolean) {
  isWritingReview.value = value
}
</script>

<style lang="scss" scoped>
@use '/scss/mixins.scss';

.product-reviews {
  margin-bottom: 100px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;

  &__count {
    font: var(--text-20);
    font-weight: 400;

    span {
      font-weight: 500;
    }
  }

  &__comments {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  &__loading-more {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 0.625rem;
  }

  @include mixins.adaptive(tablet-big) {
    margin-bottom: 50px;
  }
}
</style>
