import { useAPI } from '#imports'
import type IPagination from '~/dataAccess/api/IPagination'
import type ICatalogProduct from '~/domain/product/types/ICatalogProduct'
import type IFiltersList from '~/domain/product/types/IFiltersList'

export class Product {
  public async getBestsellers(amount: number = 3) {
    const { data, error, status } = await useAPI<IPagination<ICatalogProduct>>(
      '/products/catalog',
      {
        params: {
          per_page: amount,
        },
      }
    )

    return { data, error, status }
  }

  public async getCatalog() {
    const { data, error, status } = await useAPI<IPagination<ICatalogProduct>>(
      '/products/catalog',
      {
        params: {
          per_page: 12,
        },
      }
    )

    return { data, error, status }
  }

  public async getCatalogFilters() {
    const { data, error, status } = await useAPI<IFiltersList[]>(
      '/products/catalog/filters'
    )

    return { data, error, status }
  }
}
