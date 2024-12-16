import type { IProductCollections } from '~/domain/product/types/IProductCollections'

export const useProductCollectionsStore = defineStore(
  'productCollectionsStore',
  () => {
    const {
      data: collection,
      execute: updateCollection,
      status,
    } = useAPI<{ data: IProductCollections }>('/profile/products/collections', {
      method: 'GET',
      watch: false,
      immediate: false,
    })

    const cartCollection = computed(() => collection.value?.data.cart)
    const favoritesCollection = computed(() => collection.value?.data.favorites)

    const isLoading = computed(() => status.value === 'pending')

    const cartCount = computed(() => collection.value?.data.cart.length || null)
    const favoritesCount = computed(
      () => collection.value?.data.favorites.length || null
    )

    return {
      collection,
      isLoading,
      cartCount,
      cartCollection,
      favoritesCollection,
      favoritesCount,
      updateCollection,
    }
  }
)
