import type IPagination from '~/dataAccess/api/IPagination'
import type ICatalogProduct from '~/domain/product/types/ICatalogProduct'

export interface IInjectCatalog {
  urlQuery: ComputedRef<Record<string, any>>
  fetchingProducts: Ref<boolean>
  productsData: Ref<IPagination<ICatalogProduct> | null>
  fetchProducts: () => Promise<void>
}
