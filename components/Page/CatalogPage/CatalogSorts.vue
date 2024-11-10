<template>
  <div v-if="options.length > 0">
    <AFSelect :options="options" v-model="sortType" />
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

const router = useRouter()
const route = useRoute()

const { fetchProducts } = injectStrict<IInjectCatalog>(CatalogInject)

const { data } = await useAPI<{ data: ICatalogSortItem[] }>(
  '/products/catalog/sorts'
)

const options = computed(() => {
  const arr: ICatalogSortItem[] = []
  data.value?.data.forEach((item) => {
    arr.push(
      {
        label: `${item.label} (по возрастанию)`,
        value: `${item.value}__asc`,
        icon: ArrowUpIcon,
        iconRotate: '0deg',
      },
      {
        label: `${item.label} (по убыванию)`,
        value: `${item.value}__desc`,
        icon: ArrowUpIcon,
        iconRotate: '180deg',
      }
    )
  })
  return arr
})

const sortType = ref((route.query.sort as string) || options.value?.[0]?.value)

watch(sortType, onSortTypeChange)

async function onSortTypeChange() {
  await router.push({ query: { ...route.query, sort: sortType.value } })
  await fetchProducts()
}
</script>

<style lang="scss" scoped></style>
