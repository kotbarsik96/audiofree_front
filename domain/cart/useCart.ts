import type { IProductVariation } from '~/domain/product/types/IProductData'

export function useCart() {
  const { $afFetch } = useNuxtApp()
  const { addNotification } = useNotifications()
  const { updateCollection } = useProductCollectionsStore()

  function updateQuantity(
    quantity: number,
    variation: IProductVariation,
    isOneclick: boolean
  ) {
    return new Promise<{ ok: boolean; _data?: any }>(async (resolve) => {
      try {
        await $afFetch('/product/cart', {
          method: 'POST',
          body: {
            variation_id: variation.id,
            quantity: quantity,
            is_oneclick: isOneclick ? '1' : '',
          },
          onResponse({ response }) {
            resolve(response)
            if (response.ok) updateCollection()
          },
          onResponseError({ response }) {
            if (response._data.message) {
              addNotification('error', response._data.message)
              if (quantity > variation.quantity) quantity = variation.quantity
              else if (quantity < 1) quantity = 1
            }
          },
        })
      } catch (err) {}
    })
  }
  async function deleteCartItem(
    variation: IProductVariation,
    isOneclick: boolean
  ) {
    return new Promise<{ ok: boolean; _data?: any }>((resolve) => {
      try {
        $afFetch('product/cart/item', {
          method: 'DELETE',
          params: {
            variation_id: variation.id,
            is_oneclick: isOneclick ? '1' : '',
          },
          onResponse({ response }) {
            if (response._data.message) {
              const severity = response.ok ? 'info' : 'error'
              addNotification(severity, response._data.message)
            }
            if (response.ok) {
              updateCollection()
            }

            resolve(response)
          },
        })
      } catch (err) {}
    })
  }

  return {
    updateQuantity,
    deleteCartItem,
  }
}
