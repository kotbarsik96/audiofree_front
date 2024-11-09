import type IPagination from '~/dataAccess/api/IPagination'
import type { IProductReview } from '~/domain/product/types/IProductData'

export const useReviewsStore = defineStore('reviewsStore', () => {
  const { userId } = storeToRefs(useUserStore())
  const route = useRoute()

  const productId = computed(() => route.params.product as string)
  const page = ref(1)
  const isUpdatingReviews = ref(false)

  const reviews = useState<IProductReview[]>('reviewsArray', () => [])
  // const currentUserReview = useState<IProductReview | null>(
  //   'currentUserReview',
  //   () => null
  // )

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

  const isWritingReview = ref(false)
  const isEditingReview = computed(
    () => isWritingReview.value && !!currentUserReview.value
  )

  async function updateAllReviews() {
    isUpdatingReviews.value = true
    await loadReviews()
    await loadUserReview()
    isUpdatingReviews.value = false
  }

  return {
    productId,
    page,
    isUpdatingReviews,
    reviews,
    currentUserReview,
    reviewsData,
    reviewsLoadingStatus,
    lastPage,
    noReviews,
    isWritingReview,
    isEditingReview,
    updateAllReviews,
    loadReviews,
    loadUserReview,
  }
})
