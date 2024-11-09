import type { IProductReview } from '~/domain/product/types/IProductData'

export const ReviewInjection = Symbol('reviewInjection')

export interface IReviewInjection {
  currentUserReview: ComputedRef<IProductReview | null | undefined>
  productId: Ref<number | string>
  isWritingReview: Ref<boolean>
  isEditingReview: ComputedRef<boolean>
  updateAllReviews: () => any
  loadReviews: () => any
  loadUserReview: () => any
  updateWritingReview: (value: boolean) => any
}
