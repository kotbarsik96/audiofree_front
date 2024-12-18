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
import EmptyList from '~/components/Blocks/EmptyList.vue'
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
