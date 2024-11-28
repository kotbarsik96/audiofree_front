<template>
  <div v-if="options.length > 0" class="catalog-sorts">
    <AFSelect :options="options" v-model="sort" />
    <AFSelect :options="orderOptions" v-model="sortOrder" />
  </div>
</template>

<script setup lang="ts">
import AFSelect from '~/components/Blocks/AFSelect.vue'
import ArrowUpIcon from '~/assets/images/icons/arrow-up.svg'
import type ICatalogSortItem from '~/domain/product/types/ICatalogSortItem'
import {
  CatalogInject,
  type IInjectCatalog,
} from '~/domain/product/types/IInjectCtalog'
import type { SortOrders } from '~/enums/SortOrders'
import type ISelectOption from '~/interfaces/components/ISelectOption'

const router = useRouter()
const route = useRoute()

const { fetchProducts } = injectStrict<IInjectCatalog>(CatalogInject)

const { data } = await useAPI<{ data: ICatalogSortItem[] }>(
  '/products/catalog/sorts'
)

const options = computed(() => {
  const arr: ICatalogSortItem[] = []
  data.value?.data.forEach((item) => {
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
  await fetchProducts()
}
</script>

<style lang="scss" scoped>
.catalog-sorts{ 
  flex: 1 1 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.625rem;
}
</style>
