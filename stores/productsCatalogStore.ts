import type IPagination from '~/dataAccess/api/IPagination'
import type ICatalogProduct from '~/domain/product/types/ICatalogProduct'

export const useProductsCatalogStore = defineStore(
  'productsCatalogStore',
  () => {
    const route = useRoute()

    const urlQuery = computed<Record<string, any>>(() => ({
      ...parseRouteQuery(route.query),
      per_page: 9,
    }))
    const fetchingProducts = ref(false)

    const { data: productsData, execute: fetchProducts } = useAPI<
      IPagination<ICatalogProduct>
    >('/products/catalog', {
      query: urlQuery,
      immediate: false,
      watch: false,
    })

    return { urlQuery, fetchingProducts, productsData, fetchProducts }
  }
)
