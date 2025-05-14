import { useRouteQuery } from '@vueuse/router'
import ArrowUpIcon from '~/assets/images/icons/arrow-up.svg'
import type ISelectOption from '~/interfaces/components/ISelectOption'

export function useSorts(
  sortData:
    | Ref<{ data: ISelectOption[] } | null>
    | ComputedRef<{ data: ISelectOption[] } | null>
) {
  const options = computed(() => {
    const arr: ISelectOption[] = []
    sortData.value?.data.forEach((item) => {
      arr.push({
        label: `${item.label}`,
        value: `${item.value}`,
      })
    })
    return arr
  })
  const orderOptions: ISelectOption[] = [
    {
      value: 'asc',
      label: 'По возрастанию',
      icon: ArrowUpIcon,
      iconRotate: '0deg',
    },
    {
      value: 'desc',
      label: 'По убыванию',
      icon: ArrowUpIcon,
      iconRotate: '180deg',
    },
  ]

  const sort = useRouteQuery('sort', options.value?.[0]?.value)
  const sortOrder = useRouteQuery('sort_order', 'asc')

  return {
    options,
    orderOptions,
    sort,
    sortOrder,
  }
}
