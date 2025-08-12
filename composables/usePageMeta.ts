export interface IPageSeo {
  title: string | null
  description: string | null
}

export interface IPageMetaOptions {
  canonicalPath?: string
  titleReplace?: MaybeRefOrGetter<Record<string, string>>
  descriptionReplace?: MaybeRefOrGetter<Record<string, string>>
}

export function usePageMeta(
  data: MaybeRefOrGetter<{ data: IPageSeo } | IPageSeo | null>,
  options?: IPageMetaOptions
) {
  const route = useRoute()

  const canonicalPath = computed(() => {
    let url = import.meta.env.VITE_FRONT_URL
    url += options?.canonicalPath || route.path
    return url
  })

  const pageData = computed(() => {
    let _data = toValue(data)
    if (_data && 'data' in _data) _data = _data.data
    return _data
  })

  const title = computed(() => {
    let _title = pageData.value?.title || 'AudioFree'
    const titleReplace = options?.titleReplace
      ? toValue(options.titleReplace)
      : null

    if (titleReplace) {
      for (let str in titleReplace) {
        _title = _title.replace(str, titleReplace[str])
      }
    }

    return _title
  })

  const description = computed(() => {
    let _description = pageData.value?.description || 'AudioFree'
    const replace = options?.descriptionReplace
      ? toValue(options.titleReplace)
      : null

    if (replace) {
      for (let str in replace) {
        _description = _description.replace(str, replace[str])
      }
    }

    return _description
  })

  useHead({
    title,
    meta: [
      {
        name: 'description',
        content: description,
      },
    ],
    link: [
      {
        rel: 'canonical',
        href: canonicalPath,
      },
    ],
  })

  return { pageData }
}
