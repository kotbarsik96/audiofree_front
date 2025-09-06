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
      <EmptyList
        class="favorites-main__empty"
        :shown="list.length < 1"
        icon="empty-box"
      >
        К сожалению, ничего не найдено
      </EmptyList>
      <div class="favorites-main__intersection-el" ref="intersectionEl"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EmptyList from '~/components/_UI/EmptyList.vue'
import SearchIcon from '~/assets/images/icons/search.svg'
import InputWrapper from '~/components/_UI/FormElements/InputWrapper.vue'
import TextInput from '~/components/_UI/FormElements/TextInput.vue'
import AFSelect from '~/components/_UI/AFSelect.vue'
import ProductVariationCard from '~/components/Product/_UI/ProductCard/ProductVariationCard.vue'
import { useSorts } from '~/domain/product/useSorts'
import type ISelectOption from '~/interfaces/components/ISelectOption'
import type IVariationProduct from '~/domain/product/types/IVariationProduct'
import { useRouteQuery } from '@vueuse/router'

const intersectionEl = ref<HTMLElement>()

const { data: sortData } = await useAPI<{ data: ISelectOption[] }>(
  '/product/favorites/sorts',
  {
    credentials: 'include',
  }
)
const { options, orderOptions, sort, sortOrder } = useSorts(sortData)

const searchString = useRouteQuery('search') as Ref<string>

const [
  { list, reset: resetList, isLoading: isLoadingProducts },
  { data: pageSeoData },
] = await Promise.all([
  usePaginationLazyWrapper<IVariationProduct>(
    intersectionEl,
    '/product/favorites',
    {
      credentials: 'include',
      watch: false,
      query: {
        sort: sort,
        sort_order: sortOrder,
        search: searchString,
      },
    }
  ),
  useAPI<{ data: IPageSeo }>('page/favorites'),
])

const { refresh: resetListDelayed } = useDelayedCallback(1000, () => {
  resetList()
})

const { favoritesCount } = storeToRefs(useProductCollectionsStore())
usePageMeta(pageSeoData, {
  titleReplace: () => ({
    '%:count': favoritesCount.value
      ? `(${favoritesCount.value?.toString()}) `
      : '',
  }),
})

watch(
  () => [searchString.value, sort.value, sortOrder.value],
  () => {
    resetListDelayed()
  }
)
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.favorites-main {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 4rem;

  &__empty {
    grid-column: 1 / -1;
    grid-row: 1 / -1;

    :deep(svg) {
      width: 6rem;
      height: 6rem;
    }
  }

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
    gap: 0.625rem;
    min-height: 30rem;
    transition: var(--general-transition);
  }
  &.--loading &__list {
    opacity: 0.5;
  }

  @include mixins.adaptive(phone) {
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
