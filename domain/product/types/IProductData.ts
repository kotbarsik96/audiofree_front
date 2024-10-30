import type IImage from '~/domain/images/types/IImage'

export interface IProduct {
  id: number
  name: string
  description: string
  image_id: number
  status_id: number
  brand_id: number
  category_id: number
  type_id: number
  status: {
    id: number
    slug: string
    value: string
    value_slug: string
  }
  brand: {
    id: number
    slug: string
    value: string
    value_slug: string
  }
  category: {
    id: number
    slug: string
    value: string
    value_slug: string
  }
  type: {
    id: number
    slug: string
    value: string
    value_slug: string
  }
  info: [
    {
      id: number
      product_id: number
      name: string
      value: string
    },
    {
      id: number
      product_id: number
      name: string
      value: string
    },
    {
      id: number
      product_id: number
      name: string
      value: string
    },
    {
      id: number
      product_id: number
      name: string
      value: string
    },
    {
      id: number
      product_id: number
      name: string
      value: string
    },
    {
      id: number
      product_id: number
      name: string
      value: string
    },
    {
      id: number
      product_id: number
      name: string
      value: string
    },
    {
      id: number
      product_id: number
      name: string
      value: string
    },
    {
      id: number
      product_id: number
      name: string
      value: string
    },
    {
      id: number
      product_id: number
      name: string
      value: string
    },
    {
      id: number
      product_id: number
      name: string
      value: string
    },
    {
      id: number
      product_id: number
      name: string
      value: string
    },
    {
      id: number
      product_id: number
      name: string
      value: string
    },
    {
      id: number
      product_id: number
      name: string
      value: string
    },
    {
      id: number
      product_id: number
      name: string
      value: string
    },
    {
      id: number
      product_id: number
      name: string
      value: string
    }
  ]
  variations: [
    {
      id: number
      product_id: number
      name: string
    },
    {
      id: number
      product_id: number
      name: string
    }
  ]
}

export interface IVariation {
  id: number
  price: number
  discount: number
  name: string
  quantity: number
  current_price: number
  gallery: [
    {
      id: number
      name: string
      extension: string
      path: string
      alt: null
      disk: string
      url: string
      relativeUrl: string
      pivot: {
        attachmentable_type: string
        attachmentable_id: number
        attachment_id: number
      }
    },
    {
      id: number
      name: string
      extension: string
      path: string
      alt: null
      disk: string
      url: string
      relativeUrl: string
      pivot: {
        attachmentable_type: string
        attachmentable_id: number
        attachment_id: number
      }
    },
    {
      id: number
      name: string
      extension: string
      path: string
      alt: null
      disk: string
      url: string
      relativeUrl: string
      pivot: {
        attachmentable_type: string
        attachmentable_id: number
        attachment_id: number
      }
    },
    {
      id: number
      name: string
      extension: string
      path: string
      alt: null
      disk: string
      url: string
      relativeUrl: string
      pivot: {
        attachmentable_type: string
        attachmentable_id: number
        attachment_id: number
      }
    },
    {
      id: number
      name: string
      extension: string
      path: string
      alt: null
      disk: string
      url: string
      relativeUrl: string
      pivot: {
        attachmentable_type: string
        attachmentable_id: number
        attachment_id: number
      }
    }
  ]
}

export interface IProductData {
  product: IProduct
  variation: IVariation
  rating: number
}
