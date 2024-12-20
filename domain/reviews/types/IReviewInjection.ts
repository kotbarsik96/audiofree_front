import type { IProductReview } from '~/domain/product/types/IProductData'

export interface IReviewInjection {
  currentUserReview: ComputedRef<IProductReview | null | undefined>
  productSlug: Ref<number | string>
  isWritingReview: Ref<boolean>
  isEditingReview: ComputedRef<boolean>
  updateAllReviews: () => any
  loadReviews: () => any
  loadUserReview: () => any
  updateWritingReview: (value: boolean) => any
}
