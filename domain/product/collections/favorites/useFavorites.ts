import type INuxtFetchResponse from '~/dataAccess/api/INuxtFetchResponse'

export function useFavorites() {
  const { updateCollection } = useProductCollectionsStore()
  const { $afFetch } = useNuxtApp()

  async function addToFavorites(variationId: number) {
    let _response: INuxtFetchResponse | undefined

    try {
      await $afFetch('product/favorites', {
        method: 'POST',
        credentials: 'include',
        body: {
          variation_id: variationId,
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
  function deleteFavoriteByVariation(variationId: number) {
    return deleteFavorite({
      variation_id: variationId,
    })
  }
  function deleteFavoriteByProduct(productId: number) {
    return deleteFavorite({
      product_id: productId,
    })
  }
  async function deleteFavorite(body: Record<string, any>) {
    let _response: INuxtFetchResponse | undefined

    try {
      await $afFetch('product/favorites', {
        method: 'DELETE',
        credentials: 'include',
        body,
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

  return {
    addToFavorites,
    deleteFavoriteByProduct,
    deleteFavoriteByVariation,
  }
}
