<template>
  <InputWrapper class="psiw" rounded :icon="SearchIcon" iconPos="left">
    <TextInput
      placeholder="Поиск товара"
      v-model="searchValue"
      @focus="onInputFocus"
      @blur="onInputBlur"
    />
    <Transition name="drop-down">
      <menu v-if="showResults" class="iw-select" role="listbox">
        <ProductSearchResult
          v-for="result in results"
          :key="result.title"
          :result="result"
          @click="onResultClick"
        />
      </menu>
    </Transition>
    <Transition name="drop-down">
      <NoSearchResults
        v-if="!showResults && noResults"
        class="iw-select no-search-results"
        :search-value="searchValue"
      />
    </Transition>
    <Transition name="fade-in">
      <SpinnerLoader v-if="isPreloaderShown" class="iw-preloader" />
    </Transition>
  </InputWrapper>
</template>

<script setup lang="ts">
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'
import SearchIcon from '~/assets/images/icons/search.svg'
import ProductSearchResult from '~/components/Blocks/ProductSearch/ProductSearchResult.vue'
import SpinnerLoader from '~/components/Blocks/Loaders/SpinnerLoader.vue'
import NoSearchResults from '~/components/Blocks/ProductSearch/NoSearchResults.vue'
import type { IProductSearchResult } from '~/domain/product_search/IProductSearchResult'

const searchValue = ref('')
const lastSearchedValue = ref(searchValue.value)
const inputFocused = ref(false)

const {
  data: resultsData,
  execute,
  status,
} = useAPI<{ data: IProductSearchResult[] }>('/search/products', {
  params: {
    value: searchValue,
    type: 'searchbar',
  },
  watch: false,
  immediate: false,
})
const results = computed(() => resultsData.value?.data)
const { refresh: executeSearch } = useDelayedCallback(500, async () => {
  await execute()
  lastSearchedValue.value = searchValue.value
})
const isLoading = computed(() => status.value === 'pending')

const showResults = computed(
  () => results.value?.length && searchValue.value && inputFocused.value
)
const noResults = computed(
  () =>
    !results.value?.length &&
    lastSearchedValue.value &&
    !isLoading.value &&
    inputFocused.value
)
const isPreloaderShown = computed(() => isLoading.value)

watch(searchValue, () => {
  if (searchValue.value.trim()) executeSearch()
  else lastSearchedValue.value = ''
})

function onResultClick() {
  searchValue.value = ''
}
function onInputFocus() {
  inputFocused.value = true
}
function onInputBlur() {
  inputFocused.value = false
}
</script>

<style lang="scss" scoped>
@use '/scss/mixins.scss';

.psiw {
  .iw-select {
    z-index: 100;
  }

  .no-search-results {
    background-color: var(--white);
  }
}
</style>
