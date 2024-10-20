import { useAPI } from '#imports'
import type IPagination from '~/dataAccess/api/IPagination'
import type ICatalogProduct from '~/domain/product/types/ICatalogProduct'
import type IFilterItem from '~/domain/product/types/IFilterItem'

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
          per_page: 9,
        },
      }
    )

    return { data, error, status }
  }
}
