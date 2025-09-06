<template>
  <InputWrapper class="psiw" rounded :icon="SearchIcon" iconPos="left">
    <TextInput
      placeholder="Поиск товара"
      v-model="searchValue"
      @focus="onInputFocus"
      @blur="onInputBlur"
      @keyup.enter="onKeyupEnter"
    />
    <Transition name="drop-down">
      <menu v-if="showResults" class="iw-select" role="listbox">
        <li class="all-results" role="option" @click="onResultClick">
          <NuxtLink
            :to="{ name: 'SearchPage', query: { search: searchValue } }"
          >
            Смотреть все результаты
          </NuxtLink>
        </li>
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
import InputWrapper from '~/components/_UI/FormElements/InputWrapper.vue'
import TextInput from '~/components/_UI/FormElements/TextInput.vue'
import SearchIcon from '~/assets/images/icons/search.svg'
import ProductSearchResult from '~/components/Search/ProductSearch/UI/ProductSearchResult.vue'
import SpinnerLoader from '~/components/_UI/Loaders/SpinnerLoader.vue'
import NoSearchResults from '~/components/Search/ProductSearch/UI/NoSearchResults.vue'

const router = useRouter()

const searchValue = ref('')
const lastSearchedValue = ref(searchValue.value)
const inputFocused = ref(false)

const redirecting = ref(false)

const { results, isLoading, executeSearchWithDelay } = useProductsSearch(
  searchValue,
  'searchbar'
)

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
  if (searchValue.value.trim()) executeSearchWithDelay()
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
async function onKeyupEnter() {
  if (redirecting.value) return

  redirecting.value = true
  await router.push({
    name: 'SearchPage',
    query: { search: searchValue.value },
  })
  searchValue.value = ''
  redirecting.value = false
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.psiw {
  .iw-select {
    z-index: 100;

    a {
      width: 100%;
      height: 100%;
    }
  }

  .no-search-results {
    background-color: var(--white);
  }

  .all-results {
    display: flex;
    justify-content: center;

    a {
      text-align: center;
      font: var(--text-16);
      font-weight: 600;
    }
  }
}
</style>
