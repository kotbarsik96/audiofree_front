<template>
  <div class="ct-filter _card" :class="classes">
    <div class="ct-filter__inner _card__inner">
      <div class="ct-filter__header" @click="toggleShown">
        <div>Фильтр товаров</div>
        <AFIcon class="ct-filter__icon" :icon="FilterIcon" />
      </div>
      <div class="ct-filter__body">
        <div class="ct-filter__body-inner">
          <div class="ct-filter__sections">
            <CFilterSection
              v-for="section in filterItems"
              :key="section.name"
              :section="section"
              ref="filterSections"
            />
          </div>
          <div class="ct-filter__buttons">
            <AFButton
              v-if="lastChangedFilter"
              class="ct-filter__button"
              label="Применить фильтр"
              :disabled="areButtonsDisabled"
              @click="_refetchProducts"
            />
            <AFButton
              class="ct-filter__button"
              styleType="secondary"
              label="Очистить фильтр"
              :disabled="areButtonsDisabled"
              @click="clearFilter"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AFButton from '~/components/Blocks/AFButton.vue'
import AFIcon from '~/components/Blocks/AFIcon.vue'
import FilterIcon from '~/assets/images/icons/filter.svg'
import CFilterSection from '~/components/Blocks/CatalogFilter/CFilterSection.vue'
import type { IFilterItem } from '~/domain/product/types/IFilterItem'
import { FilterRangePrefixes } from '~/domain/product/types/FilterRangePrefixes'

const props = defineProps<{
  isFetchingProducts?: boolean
  filterItems: IFilterItem[]
}>()

const route = useRoute()
const router = useRouter()

const filterSections = ref<Array<InstanceType<typeof CFilterSection>>>([])

const isResettingFilters = ref(false)
const areButtonsDisabled = computed(
  () =>
    (props.isFetchingProducts || isResettingFilters.value) &&
    typeof window !== 'undefined'
)

const mobileShown = ref(false)

const lastChangedFilter = ref('')

const refetchFilters = inject('refetchFilters') as () => Promise<void>
const refetchProducts = inject('refetchProducts') as () => Promise<void>

provide('lastChangedFilter', lastChangedFilter)
provide('refetchFiltersOnChange', () => {
  setTimeout(async () => {
    await _refetchFilters()
  }, 250)
})

const classes = computed(() => ({
  '--shown': mobileShown.value,
}))

function toggleShown() {
  mobileShown.value = !mobileShown.value
}
async function _refetchProducts() {
  lastChangedFilter.value = ''
  await refetchProducts()
}
async function _refetchFilters() {
  await refetchFilters()
}
function apply() {
  _refetchProducts()
  lastChangedFilter.value = ''
}
async function clearFilter() {
  if (isResettingFilters.value) return
  isResettingFilters.value = true
  lastChangedFilter.value = ''

  try {
    await clearRouteQuery()
    filterSections.value.forEach((section) => section.resetBeforeFetch())
    await _refetchFilters()
    await _refetchProducts()
    filterSections.value.forEach((section) => section.resetAfterFetch())
  } catch (err) {
    console.error(err)
  }

  isResettingFilters.value = false
}
async function clearRouteQuery() {
  const clearedQuery = { ...route.query }
  // сбор слагов фильтров, которые будут удалены из route.query
  const infoSlugs =
    props.filterItems
      .find((section) => section.type === 'info')
      ?.values?.map((infoItem) => infoItem.slug) || []
  const slugs: Array<string> = props.filterItems
    .map((section) => section.slug)
    .concat(infoSlugs)

  for (let key in clearedQuery) {
    let _key = key
    const isRangePrefix =
      _key.startsWith(FilterRangePrefixes.MIN) ||
      _key.startsWith(FilterRangePrefixes.MAX)
    if (isRangePrefix) _key = _key.slice(4)

    if (slugs.includes(_key)) delete clearedQuery[key]
  }
  if (!clearedQuery.page) clearedQuery.page = '1'
  await router.push({ name: route.name, query: clearedQuery })
  // await router.replace({ name: route.name, query: clearedQuery })
}
</script>

<style lang="scss" scoped>
@use '/scss/mixins.scss';

@mixin hiddenBodyStyles {
  display: none;
  opacity: 0;
  transform: translateY(-10px);
}

@mixin shownBodyStyles {
  display: block;
  opacity: 1;
  transform: translateY(0px);
}

.ct-filter {
  --padding-x: 1.25rem;

  &,
  &::before &__inner {
    height: 100%;
  }

  &__header {
    padding: var(--padding-x);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    font: var(--text-20);
    font-weight: 500;
  }

  &__icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  &__inner {
    padding: 0;
  }

  &__body {
    position: relative;
  }

  &__body-inner {
    padding-bottom: 0.5rem;
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    margin: 0 auto;
    position: sticky;
    bottom: 0;
    z-index: 100;
    background: var(--white);
    width: 100%;
    max-width: unset;
    padding-inline: 0.625rem;
    padding-block-start: 0.625rem;
    padding-block-end: 0.625rem;
    border-top: 1px solid var(--stroke);
  }

  &__button {
    :deep(span) {
      font-weight: 500;
    }
  }

  @include mixins.adaptive(tablet-big) {
    max-width: 25rem;
    margin: 0 auto;

    &__header {
      cursor: pointer;
    }

    &__body {
      @include mixins.hiddenElementStyles;
      animation: hideElement 0.25s ease-in-out;
    }

    &.--shown &__body {
      @include mixins.shownElementStyles;
      animation-name: showElement;
    }
  }
}

@keyframes hideElement {
  0% {
    @include mixins.shownElementStyles;
  }
  100% {
    @include mixins.hiddenElementStyles;
  }
}
@keyframes showElement {
  0% {
    @include mixins.hiddenElementStyles;
  }
  100% {
    @include mixins.shownElementStyles;
  }
}
</style>
