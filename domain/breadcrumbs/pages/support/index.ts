import type { TBreadcrumbsBuilder } from '~/domain/breadcrumbs/interfaces/TBreadcrumbsBuilder'
import { homeBreadcrumbs } from '~/domain/breadcrumbs/pages'

export const supportChatsListBreadcrumbs: TBreadcrumbsBuilder = () => [
  ...homeBreadcrumbs(),
  {
    title: 'Чаты технической поддержки',
    link: { name: 'SupportChatsListPage' },
  },
]
