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
import BreadCrumbs from '~/components/Blocks/BreadCrumbs.vue'
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'
import SearchIcon from '~/assets/images/icons/search.svg'
import SearchResultIcon from '~/assets/images/icons/search-result.svg'
import ProductSearchResult from '~/components/Blocks/ProductSearch/ProductSearchResult.vue'
import SpinnerLoader from '~/components/Blocks/Loaders/SpinnerLoader.vue'
import AFPagination from '~/components/Blocks/AFPagination.vue'

const { setBreadcrumbs } = useBreadcrumbs()
const route = useRoute()

const searchValue = ref((route.query.search as string) || '')

setBreadcrumbs([
  {
    index: 2,
    label: 'Поиск',
    link: { name: 'SearchPage' },
  },
])

const page = computed(() => Number(route.query.page ?? 1))

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

watch(searchValue, () => {
  executeSearchWithDelay()
})
</script>

<style lang="scss" scoped>
@use '/scss/mixins.scss';

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
    min-height: 9rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-block-start: 1rem;
  }

  .results-title {
    align-self: flex-start;
    justify-self: flex-start;
    margin-block-end: auto;
    padding-block-end: 1rem;
  }

  .message-block {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    padding: 0.5rem 1rem;
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
