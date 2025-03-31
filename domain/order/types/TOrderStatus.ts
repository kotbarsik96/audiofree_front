export type TOrderStatus =
  | 'preparing'
  | 'delivering'
  | 'awaiting_pickup'
  | 'picked_up'
  | 'cancelled'

export const orderStatusMap: Record<TOrderStatus, string> = {
  preparing: 'В сборке',
  delivering: 'В доставке',
  awaiting_pickup: 'Ожидает получения',
  picked_up: 'Получен',
  cancelled: 'Отменен',
}
