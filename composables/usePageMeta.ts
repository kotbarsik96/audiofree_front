export interface IPageSeo {
  title: string | null
  description: string | null
}

export interface IPageMetaOptions {
  canonicalPath?: string
  titleReplace?: Record<string, string>
  descriptionReplace?: Record<string, string>
}

export function usePageMeta(
  data: MaybeRefOrGetter<{ data: IPageSeo } | null>,
  options?: IPageMetaOptions
) {
  const route = useRoute()

  const canonicalPath = computed(() => {
    let url = import.meta.env.VITE_FRONT_URL
    url += options?.canonicalPath || route.path
    return url
  })

  const pageData = computed(() => toValue(data)?.data)

  const title = computed(() => {
    let _title = pageData.value?.title || 'AudioFree'

    if (options?.titleReplace) {
      for (let str in options.titleReplace) {
        _title = _title.replace(str, options.titleReplace[str])
      }
    }

    return _title
  })

  useHead({
    title: title.value,
    meta: [
      {
        name: 'description',
        content: pageData.value?.description || 'AudioFree',
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: canonicalPath.value,
      },
    ],
  })

  return { pageData }
}
