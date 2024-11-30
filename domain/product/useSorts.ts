import ArrowUpIcon from '~/assets/images/icons/arrow-up.svg'
import type { SortOrders } from '~/enums/SortOrders'
import type ISelectOption from '~/interfaces/components/ISelectOption'

export function useSorts(
  sortData: Ref<{ data: ISelectOption[] } | null>,
  sortChangeCallback?: Function
) {
  const router = useRouter()
  const route = useRoute()

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

  const sort = ref((route.query.sort as string) || options.value?.[0]?.value)
  const sortOrder = ref<SortOrders>(
    (route.query.sort_order as SortOrders) || 'asc'
  )

  watch(sort, onSortChange)
  watch(sortOrder, onSortChange)

  async function onSortChange() {
    await router.push({
      query: { ...route.query, sort: sort.value, sort_order: sortOrder.value },
    })
    if (typeof sortChangeCallback === 'function') sortChangeCallback()
  }

  return {
    options,
    orderOptions,
    sort,
    sortOrder,
  }
}
