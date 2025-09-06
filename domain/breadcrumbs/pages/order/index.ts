import type { TBreadcrumbsBuilder } from '~/domain/breadcrumbs/interfaces/TBreadcrumbsBuilder'
import { cartBreadcrumbs, homeBreadcrumbs } from '~/domain/breadcrumbs/pages'

export const newOrderBreadcrumbs: TBreadcrumbsBuilder = () => [
  ...cartBreadcrumbs(),
  {
    title: 'Оформление заказа',
    link: { name: 'NewOrderPage' },
  },
]

export const ordersListBreadcrumbs: TBreadcrumbsBuilder = () => [
  ...homeBreadcrumbs(),
  {
    title: 'Ваши заказы',
    link: { name: 'OrdersPage' },
  },
]

export const orderBreadcrumbs = (id: MaybeRefOrGetter<string>) => {
  return () => [
    ...ordersListBreadcrumbs(),
    {
      title: `Заказ № ${toValue(id)}`,
      link: { name: 'OrderPage', params: { id: toValue(id) } },
    },
  ]
}
