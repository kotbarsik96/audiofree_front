<template>
  <div class="orders _page" :class="{ '--loading': isLoadingOrders }">
    <div class="_container">
      <div class="_page-header">
        <BreadCrumbs />
        <h1 class="_page-header__title">Список ваших заказов</h1>
      </div>
      <div class="sorts">
        <AFSelect :options="options" v-model="sort" />
        <AFSelect :options="orderOptions" v-model="sortOrder" />
      </div>
      <div class="inputs">
        <InputWrapper :icon="SearchIcon">
          <TextInput placeholder="Название товара" v-model="searchString" />
        </InputWrapper>
      </div>
      <div class="orders-body">
        <div v-if="ordersList?.length > 0" class="list">
          <OrderCard v-for="item in ordersList" :key="item.id" :data="item" />
        </div>
        <EmptyList icon="empty-box" :shown="ordersList?.length < 1">
          Не найдено оформленных заказов
        </EmptyList>
        <div class="intersection-el" ref="intersectionEl"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '~/components/_UI/BreadCrumbs.vue'
import EmptyList from '~/components/_UI/EmptyList.vue'
import OrderCard from '~/components/Orders/UI/OrderCard.vue'
import AFSelect from '~/components/_UI/AFSelect.vue'
import InputWrapper from '~/components/_UI/FormElements/InputWrapper.vue'
import TextInput from '~/components/_UI/FormElements/TextInput.vue'
import SearchIcon from '~/assets/images/icons/search.svg'
import type { IOrderListItem } from '~/domain/order/interfaces/IOrderListItem'
import type ISelectOption from '~/interfaces/components/ISelectOption'
import { useSorts } from '~/domain/product/useSorts'

const { setBreadcrumbs } = useBreadcrumbs()
setBreadcrumbs([
  {
    index: 2,
    label: 'Ваши заказы',
    link: { name: 'OrdersPage' },
  },
])

const intersectionEl = ref<HTMLElement>()

const searchString = ref('')

const { data: sortData } = await useAPI<{ data: ISelectOption[] }>(
  '/order/sorts',
  {
    credentials: 'include',
  }
)

const { options, orderOptions, sort, sortOrder } = useSorts(sortData)

const [
  { list: ordersList, reset: resetList, isLoading: isLoadingOrders },
  { data: pageSeoData },
] = await Promise.all([
  usePaginationLazyWrapper<IOrderListItem>(intersectionEl, '/order/list', {
    credentials: 'include',
    watch: false,
    query: {
      sort: sort,
      sort_order: sortOrder,
      search: searchString,
    },
  }),
  useAPI<{ data: IPageSeo }>('page/orders'),
])
usePageMeta(pageSeoData)

const { refresh: resetListDelayed } = useDelayedCallback(1000, () => {
  resetList()
})

watch(
  () => [searchString.value, sort.value, sortOrder.value],
  () => {
    resetListDelayed()
  }
)
</script>

<style lang="scss" scoped>
.orders {
  --input-width: 20rem;

  padding: 0 0 3rem 0;

  .sorts {
    padding-top: 1rem;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    flex-wrap: wrap;

    .select {
      width: var(--input-width);
      max-width: 100%;
    }
  }

  .inputs {
    margin-top: 1rem;
    display: inline-block;

    .input {
      width: var(--input-width);
      max-width: 100%;
    }
  }

  .list {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: var(--general-transition);
  }
  &.--loading .list {
    opacity: 0.5;
  }

  .orders-body {
    margin-top: 2rem;
  }
}
</style>
