<template>
  <div class="product-reviews">
    <ReviewForm class="product-reviews__form" />
    <div v-if="reviewsData?.data.reviews.total" class="product-reviews__count">
      Всего отзывов:
      <span>{{ reviewsData?.data.reviews.total }}</span>
    </div>
    <div v-if="reviews.length > 0" class="product-reviews__comments">
      <template v-if="currentUserReview">
        <div class="product-reviews__user-review-title">Ваш отзыв:</div>
        <ReviewComment
          :key="currentUserReview.id"
          class="product-reviews__comment"
          :review="currentUserReview"
        />
      </template>
      <TransitionGroup name="blur">
        <ReviewComment
          v-for="comment in reviews"
          :key="comment.id"
          class="product-reviews__comment"
          :review="comment"
        />
      </TransitionGroup>
      <div v-if="status === 'pending'" class="product-reviews__loading-more">
        <SmallPreloader />
        <div>Загружаем еще отзывы...</div>
      </div>
    </div>
    <div v-else class="product-reviews__empty">
      <CommentsIcon class="product-reviews__empty-icon" />
      <p>Отзывов еще нет. Напишите первым!</p>
    </div>
    <div class="product-reviews__intersection-el" ref="intersectionEl"></div>
  </div>
</template>

<script setup lang="ts">
import CommentsIcon from '~/assets/images/icons/comments.svg'
import ReviewForm from '~/components/Blocks/Review/ReviewForm.vue'
import ReviewComment from '~/components/Blocks/Review/ReviewComment.vue'
import SmallPreloader from '~/components/Blocks/SmallPreloader.vue'
import type { IProductReview } from '~/domain/product/types/IProductData'
import type IPagination from '~/dataAccess/api/IPagination'

const intersectionEl = ref<HTMLElement>()

const route = useRoute()

const page = ref(1)
const lastPage = computed(() => reviewsData.value?.data.reviews.last_page || 1)

const productId = computed(() => route.params.product)

const reviews = useState<IProductReview[]>('reviewsArray', () => [])

const { data: reviewsData, status } = await useAPI<{
  data: {
    reviews: IPagination<IProductReview>
    current_user_review: IProductReview
  }
}>(`/products/${productId.value}/reviews`, {
  params: {
    page,
  },
  onResponse({ response }) {
    const arr: IProductReview[] | null = response._data.data.reviews.data
    if (Array.isArray(arr)) reviews.value.push(...arr)
  },
  watch: [page],
})

const currentUserReview = computed(
  () => reviewsData.value?.data.current_user_review
)

let observer: IntersectionObserver

onMounted(() => {
  observer = new IntersectionObserver(observerCallback, {
    rootMargin: '0px 0px 0px 0px',
    threshold: 1,
  })
  if (intersectionEl.value) observer.observe(intersectionEl.value)
})
onUnmounted(() => {
  observer.disconnect()
})

function observerCallback(entries: IntersectionObserverEntry[]) {
  /** прибавить страницу, если:
   * не идет загрузка,
   * не последняя страница,
   * есть пересечение
   */
  const shouldUpdatePage =
    status.value !== 'pending' &&
    page.value < lastPage.value &&
    entries.some((entry) => entry.isIntersecting)

  if (shouldUpdatePage) page.value++
}
</script>

<style lang="scss" scoped>
.product-reviews {
  margin-bottom: 100px;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__count {
    @include fontSize(21);
    font-weight: 400;

    span {
      font-weight: 500;
    }
  }

  &__user-review-title {
    @include fontSize(21);
    font-weight: 500;
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
