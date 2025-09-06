import type { IProductCollections } from '~/domain/product/types/IProductCollections'
import type IUser from '~/domain/user/types/IUser'

export const useProductCollectionsStore = defineStore(
  'productCollectionsStore',
  () => {
    const user = useSanctumUser<IUser>()

    const {
      data: collection,
      execute: _updateCollection,
      status,
    } = useAPI<{ data: IProductCollections }>('/profile/products/collections', {
      method: 'GET',
      watch: false,
      credentials: 'include',
      immediate: false,
    })

    const cartCollection = computed(() => collection.value?.data.cart)
    const favoritesCollection = computed(() => collection.value?.data.favorites)

    const isLoading = computed(() => status.value === 'pending')

    const cartCount = computed(() => collection.value?.data.cart.length || null)
    const favoritesCount = computed(
      () => collection.value?.data.favorites.length || null
    )

    function updateCollection(forced?: boolean) {
      if (!!user.value || forced) _updateCollection()
    }

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
