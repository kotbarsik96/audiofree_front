import type { IProductVariation } from '~/domain/product/types/IProductData'

export function useCart() {
  const { $afFetch } = useNuxtApp()
  const { updateCollection } = useProductCollectionsStore()

  async function addToCart(
    quantity: number,
    variation: IProductVariation,
    isOneclick: boolean
  ) {
    let _response: (Response & { _data?: any }) | undefined

    try {
      await $afFetch('/product/cart', {
        method: 'POST',
        body: {
          variation_id: variation.id,
          quantity: quantity,
          is_oneclick: isOneclick ? '1' : '',
        },
        onResponse({ response }) {
          _response = response
          showResponseMessage(response)

          if (response.ok) updateCollection()
        },
      })
    } catch (err) {
      console.error(err)
    }

    return _response
  }
  async function updateQuantity(
    quantity: number,
    variation: IProductVariation,
    isOneclick: boolean
  ) {
    let _response: (Response & { _data?: any }) | undefined

    try {
      await $afFetch('/product/cart', {
        method: 'POST',
        body: {
          variation_id: variation.id,
          quantity: quantity,
          is_oneclick: isOneclick ? '1' : '',
        },
        onResponse({ response }) {
          _response = response
          showResponseMessage(response, { noOkResponse: true })

          if (response.ok) updateCollection()
        },
        onResponseError() {
          if (quantity > variation.quantity) quantity = variation.quantity
          else if (quantity < 1) quantity = 1
        },
      })
    } catch (err) {
      console.error(err)
    }

    return _response
  }
  async function deleteCartItem(
    variation: IProductVariation,
    isOneclick: boolean
  ) {
    let _response: Response | undefined

    try {
      await $afFetch('product/cart/item', {
        method: 'DELETE',
        params: {
          variation_id: variation.id,
          is_oneclick: isOneclick ? '1' : '',
        },
        onResponse({ response }) {
          _response = response
          showResponseMessage(response)

          if (response.ok) {
            updateCollection()
          }
        },
      })
    } catch (err) {
      console.error(err)
    }

    return _response
  }

  return {
    addToCart,
    updateQuantity,
    deleteCartItem,
  }
}
