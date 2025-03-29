export type TDeliveryPlaces = 'pickup_point' | 'to_door'

export const deliveryPlacesMap: Record<TDeliveryPlaces, string> = {
  pickup_point: 'Пункт выдачи',
  to_door: 'Доставка на дом'
}