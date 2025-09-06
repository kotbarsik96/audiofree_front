<template>
  <div class="search-page _page">
    <div class="_container">
      <div class="sp-wrapper _section-box">
        <BreadCrumbs class="sp-breadcrumbs" />
        <h1 class="_h1 sp-title">Поиск</h1>
        <InputWrapper :icon="SearchIcon">
          <TextInput v-model="searchValue" placeholder="Поиск товара" />
          <Transition name="fade-in">
            <SpinnerLoader v-if="isLoading" class="iw-preloader" />
          </Transition>
        </InputWrapper>
        <div class="results" :class="{ '--loading': isLoading }">
          <h2 class="_h2 results-title">Результаты</h2>
          <div class="results-body">
            <Transition name="blur">
              <ul v-if="results?.length" class="results-list">
                <ProductSearchResult
                  class="rl-item"
                  v-for="result in results"
                  :key="result.title"
                  :result="result"
                />
              </ul>
              <div v-else-if="resultsNotFound" class="message-block">
                <SearchResultIcon class="mb-icon" />
                <div class="mb-text">
                  Не удалось найти результаты по запросу
                  <span>{{ searchValue }}</span>
                </div>
              </div>
              <div v-else-if="searchStringIsEmpty" class="message-block">
                <SearchResultIcon class="mb-icon" />
                <div class="mb-text">
                  Результаты появятся после ввода поискового запроса
                  <span>{{ searchValue }}</span>
                </div>
              </div>
            </Transition>
          </div>
          <AFPagination
            v-if="pagination && paginationShown"
            :disabled="isLoading"
            :per-page="pagination.per_page"
            :total="pagination.total_items"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '~/components/_UI/BreadCrumbs.vue'
import InputWrapper from '~/components/_UI/FormElements/InputWrapper.vue'
import TextInput from '~/components/_UI/FormElements/TextInput.vue'
import SearchIcon from '~/assets/images/icons/search.svg'
import SearchResultIcon from '~/assets/images/icons/search-result.svg'
import ProductSearchResult from '~/components/Search/ProductSearch/_UI/ProductSearchResult.vue'
import SpinnerLoader from '~/components/_UI/Loaders/SpinnerLoader.vue'
import AFPagination from '~/components/_UI/AFPagination.vue'
import { useRouteQuery } from '@vueuse/router'
import { useBreadcrumbs } from '~/domain/breadcrumbs/useBreadcrumbs'
import { searchBreadcrumbs } from '~/domain/breadcrumbs/pages'

useBreadcrumbs(searchBreadcrumbs)

const searchValue = useRouteQuery<string>('search')
const page = useRouteQuery<number>('page', 1, {
  transform: Number,
})

const {
  executeSearchWithDelay,
  isLoading,
  lastSearchedValue,
  results,
  execute,
  pagination,
} = useProductsSearch(searchValue, 'full', page)

const resultsNotFound = computed(
  () =>
    !results.value?.length &&
    !isLoading.value &&
    !!searchValue.value.trim() &&
    lastSearchedValue.value === searchValue.value
)
const searchStringIsEmpty = computed(
  () => !isLoading.value && !searchValue.value
)
const paginationShown = computed(
  () => pagination.value && pagination.value.total_pages > 1
)

await execute()

let initialPage = page.value
setCorrectPage()
if (initialPage !== page.value) await execute()

watch(searchValue, () => {
  executeSearchWithDelay()
})

watch(pagination, setCorrectPage)

function setCorrectPage() {
  const pages = pagination.value?.total_pages
  if (pages && page.value > pages) {
    page.value = pages
  }

  if (pages && page.value < 1) page.value = 1
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.search-page {
  margin-block-end: 3.75rem;

  .sp-breadcrumbs {
    margin-block-end: 1rem;
  }

  .sp-title {
    margin-block-end: 1rem;
  }

  .sp-wrapper {
    padding: 1rem 2rem;
  }

  .results {
    position: relative;
    margin-block-start: 1rem;
  }

  .results-body {
    min-height: 9rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .results-title {
    padding-block-end: 1rem;
  }

  .message-block {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    padding: 1rem 0.5rem 0.5rem 0.5rem;
    top: auto;
    left: auto;

    .mb-icon {
      width: 50px;
      aspect-ratio: 1;
      color: var(--gray-800);
    }

    .mb-text {
      color: var(--gray-600);
      font-weight: 500;
      text-align: center;

      span {
        font-weight: 600;
        color: var(--gray-800);
      }
    }
  }

  .results-list {
    flex: 1 1 auto;
    width: 100%;
  }

  .rl-item {
    border-bottom: 1px solid var(--gray-200);

    &:last-child {
      border-bottom: 0;
    }

    :deep(.link) {
      align-items: center;
      padding-block: 0.5rem 0.15rem;
      padding-inline: 0.5rem;
      transition: var(--general-transition);
      row-gap: 0.25rem;

      .title,
      .description {
        font: var(--text-18);
        font-weight: 600;
      }

      .match {
        font: var(--text-18);
        font-weight: 500;
      }

      &:hover {
        background-color: var(--gray-100);
      }
    }
  }
}
</style>
