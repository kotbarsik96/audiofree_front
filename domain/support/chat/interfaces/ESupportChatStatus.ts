export enum ESupportChatStatus {
  Open = 'open',
  Closed = 'closed',
}

export const supportChatStatusOptions: Array<{
  value: ESupportChatStatus | 'all'
  label: string
}> = [
  {
    value: 'all',
    label: 'Все',
  },
  {
    value: ESupportChatStatus.Closed,
    label: 'Закрытые',
  },
  {
    value: ESupportChatStatus.Open,
    label: 'Открытые',
  },
]
