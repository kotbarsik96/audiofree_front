<template>
  <div class="pagination">
    <div class="pagination__button-wrapper">
      <NuxtLink
        v-if="toPrevPage"
        class="pagination__button pagination__button--prev"
        :to="toPrevPage"
      >
        <AFIcon :icon="ChevronRightIcon" rotate="180deg" />
      </NuxtLink>
    </div>
    <ul v-if="visiblePages.length > 0" class="pagination__list">
      <li v-for="page in visiblePages" :key="page">
        <NuxtLink
          class="pagination__link"
          :class="{ active: page === currentPage }"
          :to="getUrl(page, route.query)"
        >
          {{ page }}
        </NuxtLink>
      </li>
      <template v-if="toLastPage">
        <li>...</li>
        <li>
          <NuxtLink class="pagination__link" :to="toLastPage">
            {{ pages }}
          </NuxtLink>
        </li>
      </template>
    </ul>
    <div class="pagination__button-wrapper">
      <NuxtLink
        v-if="toNextPage"
        class="pagination__button pagination__button--next"
        :to="toNextPage"
      >
        <AFIcon :icon="ChevronRightIcon" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AFIcon from '~/components/Blocks/AFIcon.vue'
import ChevronRightIcon from '~/assets/images/icons/chevron-right.svg'
import type { LocationQuery } from 'vue-router'

const props = withDefaults(
  defineProps<{
    total: number
    perPage: number
    radius?: number // кол-во страниц вокруг текущей
  }>(),
  {
    radius: 2,
  }
)

const route = useRoute()
const router = useRouter()

const pages = computed(() => Math.ceil(props.total / props.perPage))
const currentPage = computed(() => Number(route.query.page) || 1)
const visiblePages = computed(() => {
  if(!pages.value) return []

  const onPrev: number[] = []
  const onNext: number[] = []

  for (let i = 1; i <= props.radius; i++) {
    const p = currentPage.value - i
    if (p > 0) onPrev.push(p)
  }
  for (let i = 1; i <= props.radius; i++) {
    const p = currentPage.value + i
    if (p <= pages.value) onNext.push(p)
  }

  return [...onPrev.reverse(), currentPage.value, ...onNext]
})

const toPrevPage = computed(() => {
  const page = Number(route.query.page) - 1

  if (isNaN(Number(page)) || page < 1) return null

  return {
    query: {
      ...route.query,
      page,
    },
  }
})
const toNextPage = computed(() => {
  const page = Number(route.query.page) + 1

  if (isNaN(page) || page > pages.value) return null

  return {
    query: {
      ...route.query,
      page,
    },
  }
})
const toLastPage = computed(() => {
  const page = pages.value

  if (isNaN(Number(page)) || visiblePages.value.includes(page)) return null

  return {
    query: {
      ...route.query,
      page,
    },
  }
})

watch(() => route.query.page, checkIfCorrectPage)

onMounted(() => checkIfCorrectPage())

function getUrl(page: number, routeQuery: LocationQuery) {
  return { query: { ...routeQuery, page } }
}
function checkIfCorrectPage() {
  if (currentPage.value < 1)
    router.replace({ query: { ...route.query, page: 1 } })
  if (currentPage.value > pages.value)
    router.replace({ query: { ...route.query, page: pages.value } })
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  &__list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.625rem;
  }

  &__button-wrapper {
    width: 0.5rem;
  }

  &__link {
    display: inline-block;
    padding: 0.625rem;
    color: var(--text-color);
    @include fontSize(16);
    border: 1px solid var(--text-color);
    border-radius: 7px;
    transition: var(--general-transition);
    min-width: 2.9rem;
    text-align: center;

    &:hover {
      background-color: var(--primary-transparent);
      color: var(--white);
    }
    &.active {
      color: var(--white);
      background-color: var(--primary);
      border-color: var(--primary);
    }
  }
}
</style>
