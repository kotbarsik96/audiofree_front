<template>
  <div class="product-reviews">
    <div v-if="noReviews" class="product-reviews__empty">
      <svg class="product-reviews__empty-icon" viewBox="0 0 64 64">
        <g>
          <path
            fill="currentColor"
            d="M60,0H16c-2.211,0-4,1.789-4,4v6H4c-2.211,0-4,1.789-4,4v30c0,2.211,1.789,4,4,4h7c0.553,0,1,0.447,1,1v11
		c0,1.617,0.973,3.078,2.469,3.695C14.965,63.902,15.484,64,16,64c1.039,0,2.062-0.406,2.828-1.172l14.156-14.156
		c0,0,0.516-0.672,1.672-0.672S50,48,50,48c2.211,0,4-1.789,4-4v-8h6c2.211,0,4-1.789,4-4V4C64,1.789,62.211,0,60,0z M52,44
		c0,1.105-0.895,2-2,2c0,0-14.687,0-15.344,0C32.709,46,32,47,32,47S20,59,18,61c-2.141,2.141-4,0.391-4-1c0-1,0-12,0-12
		c0-1.105-0.895-2-2-2H4c-1.105,0-2-0.895-2-2V14c0-1.105,0.895-2,2-2h46c1.105,0,2,0.895,2,2V44z M62,32c0,1.105-0.895,2-2,2h-6V14
		c0-2.211-1.789-4-4-4H14V4c0-1.105,0.895-2,2-2h44c1.105,0,2,0.895,2,2V32z"
          />
          <path
            fill="currentColor"
            d="M13,24h13c0.553,0,1-0.447,1-1s-0.447-1-1-1H13c-0.553,0-1,0.447-1,1S12.447,24,13,24z"
          />
          <path
            fill="currentColor"
            d="M41,28H13c-0.553,0-1,0.447-1,1s0.447,1,1,1h28c0.553,0,1-0.447,1-1S41.553,28,41,28z"
          />
          <path
            fill="currentColor"
            d="M34,34H13c-0.553,0-1,0.447-1,1s0.447,1,1,1h21c0.553,0,1-0.447,1-1S34.553,34,34,34z"
          />
        </g>
      </svg>
      <p>Отзывов еще нет. Напишите первым!</p>
    </div>
    <ReviewForm
      v-if="!currentUserReview"
      :isWriting="true"
      class="product-reviews__form"
    />
    <div v-if="reviewsData?.data.total" class="product-reviews__count">
      Всего отзывов:
      <span>{{ reviewsData?.data.total }}</span>
    </div>
    <div class="product-reviews__comments">
      <CurrentUserReview
        v-if="currentUserReview"
        :review="currentUserReview"
        :productId="productId"
      />
      <TransitionGroup v-if="!noReviews" name="blur">
        <ReviewComment
          v-for="comment in reviews"
          :key="comment.id"
          class="product-reviews__comment"
          :review="comment"
          :productId="productId"
        />
      </TransitionGroup>
      <div
        v-if="reviewsLoadingStatus === 'pending'"
        class="product-reviews__loading-more"
      >
        <SmallPreloader />
        <div>Загружаем еще отзывы...</div>
      </div>
    </div>
    <div class="product-reviews__intersection-el" ref="intersectionEl"></div>
  </div>
</template>

<script setup lang="ts">
import ReviewForm from '~/components/Blocks/Review/ReviewForm.vue'
import ReviewComment from '~/components/Blocks/Review/ReviewComment.vue'
import SmallPreloader from '~/components/Blocks/SmallPreloader.vue'
import CurrentUserReview from '~/components/Blocks/Review/CurrentUserReview.vue'
import type { IProductReview } from '~/domain/product/types/IProductData'
import type IPagination from '~/dataAccess/api/IPagination'
import {
  ReviewInjection,
  type IReviewInjection,
} from '~/domain/reviews/types/IReviewInjection'

const { isAuth, userId } = storeToRefs(useUserStore())
const route = useRoute()

const productId = computed(() => route.params.product as string)
const page = ref(1)
const isUpdatingReviews = ref(false)

const reviews = useState<IProductReview[]>('reviewsArray', () => [])

const {
  data: reviewsData,
  status: reviewsLoadingStatus,
  execute: loadReviews,
} = useAPI<{
  data: IPagination<IProductReview>
}>(`/products/${productId.value}/reviews`, {
  immediate: false,
  params: {
    page,
    per_page: 5,
  },
  onResponse({ response }) {
    if (!isUpdatingReviews.value) {
      let arr: IProductReview[] | null = response._data.data.data
      if (Array.isArray(arr)) {
        // не показывать отзыв текущего пользователя на первой странице
        if (page.value === 1)
          arr = arr.filter((review) => review.user_id !== userId.value)
        reviews.value.push(...arr)
      }
    }
  },
  watch: [page],
})

const { data: currentUserReviewData, execute: loadUserReview } = useAPI<{
  data: IProductReview | null
}>(`/product/${productId.value}/user-review`, {
  watch: false,
  immediate: false,
})
const currentUserReview = computed(() => currentUserReviewData.value?.data)

const lastPage = computed(() => reviewsData.value?.data.last_page || 1)
const noReviews = computed(
  () => !reviews.value.length && !currentUserReview.value
)

const intersectionEl = ref<HTMLElement>()

await loadReviews()

if (isAuth.value) {
  await loadUserReview()
}

const isWritingReview = ref(false)
const isEditingReview = computed(
  () => isWritingReview.value && !!currentUserReview.value
)

watch(userId, async () => {
  await loadUserReview()
})

let observer: IntersectionObserver

onMounted(() => {
  observer = new IntersectionObserver(observerCallback, {
    rootMargin: '0px 0px 0px 0px',
    threshold: 1,
  })
  if (intersectionEl.value) observer.observe(intersectionEl.value)
})
onUnmounted(() => {
  if (observer) observer.disconnect()
})

provide<IReviewInjection>(ReviewInjection, {
  currentUserReview,
  productId,
  isWritingReview,
  isEditingReview,
  updateAllReviews,
  loadReviews,
  loadUserReview,
  updateWritingReview,
})

function observerCallback(entries: IntersectionObserverEntry[]) {
  /** прибавить страницу, если:
   * не идет загрузка,
   * не последняя страница,
   * есть пересечение
   */
  const shouldUpdatePage =
    reviewsLoadingStatus.value !== 'pending' &&
    page.value < lastPage.value &&
    entries.some((entry) => entry.isIntersecting)

  if (shouldUpdatePage) page.value++
}
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
.product-reviews {
  margin-bottom: 100px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;

  &__count {
    @include fontSize(21);
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

  &__empty {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 500;
    @include fontSize(18);
  }

  &__empty-icon {
    width: 5rem;
    height: 5rem;
    margin-bottom: 0.625rem;
  }

  &__loading-more {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 0.625rem;
  }

  @include adaptive(tablet-big) {
    margin-bottom: 50px;
  }
}
</style>
