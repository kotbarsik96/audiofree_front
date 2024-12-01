<template>
  <div class="favorites-main" :class="{ '--loading': isLoadingProducts }">
    <div class="favorites-main__sorts">
      <AFSelect :options="orderOptions" v-model="sortOrder" />
      <AFSelect :options="options" v-model="sort" />
    </div>
    <div class="favorites-main__search">
      <InputWrapper class="favorites-main__search-wrapper" :icon="SearchIcon">
        <TextInput placeholder="Поиск" v-model="searchString" />
      </InputWrapper>
    </div>
    <div class="favorites-main__list">
      <TransitionGroup name="blur-relative">
        <ProductVariationCard
          v-for="item in list"
          :key="item.variation_id"
          :data="item"
        />
      </TransitionGroup>
      <div class="favorites-main__intersection-el" ref="intersectionEl"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchIcon from '~/assets/images/icons/search.svg'
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'
import AFSelect from '~/components/Blocks/AFSelect.vue'
import ProductVariationCard from '~/components/Blocks/Cards/ProductVariationCard.vue'
import { useSorts } from '~/domain/product/useSorts'
import type ISelectOption from '~/interfaces/components/ISelectOption'
import type IVariationProduct from '~/domain/product/types/IVariationProduct'

const route = useRoute()
const router = useRouter()

const intersectionEl = ref<HTMLElement>()

const { data: sortData } = await useAPI<{ data: ISelectOption[] }>(
  '/product/favorites/sorts'
)
const { options, orderOptions, sort, sortOrder } = useSorts(sortData)

const searchString = ref(route.query.search as string)
const { refresh: refreshSearch } = useDelayedCallback(500, () => {
  router.push({ query: { ...route.query, search: searchString.value } })
})

const {
  list,
  refresh: refreshList,
  isLoading: isLoadingProducts,
} = usePaginationLazyWrapper<IVariationProduct>(
  intersectionEl,
  '/product/favorites',
  {
    method: 'GET',
    watch: false,
    query: {
      sort: sort,
      sort_order: sortOrder,
      search: searchString,
    },
  }
)
await refreshList()
const { refresh: refreshListDelayed } = useDelayedCallback(1000, () => {
  refreshList()
})

watch(searchString, refreshSearch)
watch(
  () => [searchString.value, sort.value, sortOrder.value],
  () => {
    refreshListDelayed()
  }
)
</script>

<style lang="scss" scoped>
.favorites-main {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 4rem;

  &__sorts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;

    .select {
      min-width: 20rem;
    }
  }

  &__search {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    flex-wrap: wrap;
  }

  &__search-wrapper {
    min-width: 20rem;
  }

  &__list {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fit, 17rem);
    justify-content: center;
    gap: 0.625rem;
    min-height: 30rem;
    transition: var(--general-transition);
  }
  &.--loading &__list {
    opacity: 0.5;
  }

  @include adaptive(phone) {
    &__sorts {
      .select {
        min-width: unset;
        width: 100%;
      }
    }

    &__search-wrapper {
      min-width: unset;
      width: 100%;
    }
  }
}
</style>
