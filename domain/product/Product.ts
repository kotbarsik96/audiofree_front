import { useAPI } from '#imports'
import type IPagination from '~/dataAccess/api/IPagination'
import type ICatalogProduct from '~/domain/product/types/ICatalogProduct'
import { ProductStatuses } from '~/domain/product/types/ProductStatuses'

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

  public static statusMap(status: ProductStatuses) {
    const statusMap: Record<ProductStatuses, string> = {
      [ProductStatuses.Active]: 'В наличии',
      [ProductStatuses.Inactive]: 'Нет в наличии',
    }

    return statusMap[status]
  }
}
