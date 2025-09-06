import { catalogBreadcrumbs } from '~/domain/breadcrumbs/pages'
import type {
  IProduct,
  IProductVariation,
} from '~/domain/product/types/IProductData'

export const productBreadcrumbs = (
  product: MaybeRefOrGetter<IProduct | undefined>,
  variation: MaybeRefOrGetter<IProductVariation | undefined>
) => {
  return () => [
    ...catalogBreadcrumbs(),
    {
      title: `${toValue(product) ? toValue(product)?.brand.value + ' ' : ''}${
        toValue(product)?.name
      } (${toValue(variation)?.name})`,
      link: {
        name: 'ProductPage',
        params: {
          product: toValue(product)?.slug,
          variation: toValue(variation)?.slug,
        },
      },
    },
  ]
}
