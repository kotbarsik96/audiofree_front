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
    <ul class="pagination__list">
      <li v-for="page in visiblePages" :key="page">
        <NuxtLink
          class="pagination__link"
          :class="{ active: page === currentPage }"
          :to="getUrl(page)"
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
import { useRoute } from '#app'
import AFIcon from '~/components/Blocks/AFIcon.vue'
import ChevronRightIcon from '~/assets/images/icons/chevron-right.svg'

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

const pages = computed(() => Math.ceil(props.total / props.perPage))
const currentPage = computed(() => Number(route.query.page) || 1)
const visiblePages = computed(() => {
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

  if (page < 1) return null

  return {
    name: route.name,
    query: {
      page,
    },
  }
})
const toNextPage = computed(() => {
  const page = Number(route.query.page) + 1

  if (page > pages.value) return null

  return {
    name: route.name,
    query: {
      page,
    },
  }
})
const toLastPage = computed(() => {
  const page = pages.value

  if (visiblePages.value.includes(page)) return null

  return {
    name: route.name,
    query: {
      page,
    },
  }
})

function getUrl(page: number) {
  return { name: route.name, query: { page } }
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
