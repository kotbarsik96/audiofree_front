import type { TBreadcrumbsBuilder } from '~/domain/breadcrumbs/interfaces/TBreadcrumbsBuilder'

export const homeBreadcrumbs: TBreadcrumbsBuilder = () => [
  {
    title: 'Главная',
    link: { name: 'HomePage' },
  },
]

export const contactsBreadcrumbs: TBreadcrumbsBuilder = () => [
  ...homeBreadcrumbs(),
  {
    title: 'Контакты',
    link: { name: 'ContactsPage' },
  },
]

export const deliveryPaymentBreadcrumbs: TBreadcrumbsBuilder = () => [
  ...homeBreadcrumbs(),
  {
    title: 'Доставка и оплата',
    link: { name: 'DeliveryPaymentPage' },
  },
]

export const guaranteesRefundBreadcrumbs: TBreadcrumbsBuilder = () => [
  ...homeBreadcrumbs(),
  {
    title: 'Гарантия и возврат',
    link: { name: 'GuaranteesRefundPage' },
  },
]

export const cartBreadcrumbs: TBreadcrumbsBuilder = () => [
  ...homeBreadcrumbs(),
  {
    title: 'Корзина',
    link: { name: 'CartPage' },
  },
]

export const catalogBreadcrumbs: TBreadcrumbsBuilder = () => [
  ...homeBreadcrumbs(),
  {
    title: 'Каталог',
    link: { name: 'CatalogPage' },
  },
]

export const favoritesBreadcrumbs: TBreadcrumbsBuilder = () => [
  ...homeBreadcrumbs(),
  {
    title: 'Избранное',
    link: { name: 'FavoritesPage' },
  },
]

export const ordersBreadcrumbs: TBreadcrumbsBuilder = () => [
  ...homeBreadcrumbs(),
  {
    title: 'Заказы',
    link: { name: 'OrdersPage' },
  },
]

export const profileBreadcrumbs: TBreadcrumbsBuilder = () => [
  ...homeBreadcrumbs(),
  {
    title: 'Профиль',
    link: { name: 'ProfilePage' },
  },
]

export const searchBreadcrumbs: TBreadcrumbsBuilder = () => [
  ...homeBreadcrumbs(),
  {
    title: 'Поиск',
    link: { name: 'SearchPage' },
  },
]
