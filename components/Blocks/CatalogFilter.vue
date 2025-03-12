<template>
  <div class="ct-filter _card" :class="className">
    <div class="ct-filter__inner _card__inner">
      <div class="ct-filter__header" @click="toggleShown">
        <div>Фильтр товаров</div>
        <AFIcon class="ct-filter__icon" :icon="FilterIcon" />
      </div>
      <div
        class="ct-filter__body"
        ref="bodyEl"
        :style="{ '--body-mobile-height': bodyMobileHeight }"
      >
        <div class="ct-filter__body-inner">
          <div class="ct-filter__sections">
            <div
              v-for="section in filters"
              :key="section.name"
              class="ct-filter__section"
            >
              <div class="ct-filter__section-name">
                {{ section.name }}
              </div>
              <div class="ct-filter__section-body">
                <CFilterCheckboxes
                  v-if="
                    (section.type === 'checkbox' ||
                      section.type === 'checkbox_boolean') &&
                    section.values
                  "
                  :type="section.type"
                  :slug="section.slug"
                  :values="section.values"
                  ref="filterSectionEl"
                />
                <CFilterRadios
                  v-else-if="section.type === 'radio' && section.values"
                  :slug="section.slug"
                  :values="section.values"
                  ref="filterSectionEl"
                />
                <CFilterRange
                  v-else-if="section.type === 'range'"
                  :slug="section.slug"
                  :min="Math.floor(section.min ?? 0)"
                  :max="Math.floor(section.max ?? 0)"
                  ref="filterSectionEl"
                />
              </div>
            </div>
          </div>
          <div class="ct-filter__buttons">
            <AFButton
              class="ct-filter__button"
              label="Применить фильтр"
              :disabled="areButtonsDisabled"
              @click="refetchProducts"
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
import CFilterCheckboxes from '~/components/Blocks/CatalogFilter/CFilterCheckboxes.vue'
import CFilterRadios from '~/components/Blocks/CatalogFilter/CFilterRadios.vue'
import FilterIcon from '~/assets/images/icons/filter.svg'
import CFilterRange from '~/components/Blocks/CatalogFilter/CFilterRange.vue'
import type IFilterItem from '~/domain/product/types/IFilterItem'
import { FilterRangePrefixes } from '~/domain/product/types/FilterRangePrefixes'

const props = defineProps<{
  isFetchingProducts?: boolean
}>()

const emit = defineEmits<{
  (e: 'refetchProducts'): void
}>()

const route = useRoute()
const router = useRouter()

const filterSectionEl = ref<
  Array<
    InstanceType<
      typeof CFilterCheckboxes | typeof CFilterRadios | typeof CFilterRange
    >
  >
>([])

const urlQuery = computed(() => route.query)

const isResettingFilters = ref(false)
const areButtonsDisabled = computed(
  () =>
    (props.isFetchingProducts || isResettingFilters.value) &&
    typeof window !== 'undefined'
)

const bodyEl = ref<HTMLElement>()

const mobileShown = ref(false)
const bodyMobileHeight = ref('0px')

const className = computed(() => ({
  shown: mobileShown.value,
}))

const {
  data: filtersData,
  refresh: refetchFilters,
  status,
} = await useAPI<{
  data: IFilterItem[]
}>('/products/catalog/filters', {
  method: 'GET',
  query: urlQuery,
  watch: false,
})
const pending = computed(() => status.value === 'pending')
const filters = computed(() => filtersData.value?.data || [])

const { refresh: refetchFiltersDelayed } = useDelayedCallback(250, () => {
  if (!pending.value) refetchFilters()
})

watch(mobileShown, () => {
  if (mobileShown.value)
    bodyMobileHeight.value = `${bodyEl.value?.scrollHeight || 0}px`
  else bodyMobileHeight.value = '0px'
})
watch(urlQuery, () => refetchFiltersDelayed())

function toggleShown() {
  mobileShown.value = !mobileShown.value
}
function refetchProducts() {
  emit('refetchProducts')
}
async function clearFilter() {
  if (isResettingFilters.value) return
  isResettingFilters.value = true

  try {
    await clearRouteQuery()
    await refetchFilters()
    filterSectionEl.value.forEach((component) => {
      if (typeof component.reset === 'function') component.reset()
    })
    refetchProducts()
  } catch (err) {
    console.error(err)
  }

  isResettingFilters.value = false
}
async function clearRouteQuery() {
  const clearedQuery = { ...route.query }
  const slugs = filters.value.map((section) => section.slug)
  for (let key in clearedQuery) {
    let _key = key
    const isRangePrefix =
      _key.startsWith(FilterRangePrefixes.MIN) ||
      _key.startsWith(FilterRangePrefixes.MAX)
    if (isRangePrefix) _key = _key.slice(4)

    if (slugs.includes(_key)) delete clearedQuery[key]
  }
  await router.replace({ name: route.name, query: clearedQuery })
}
</script>

<style lang="scss" scoped>
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
    @include fontSize(20);
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
    overflow: hidden;
  }
  &__body-inner {
    padding-bottom: 1.25rem;
  }

  &__section {
    border-top: 1px solid var(--stroke);
    padding: 2rem var(--padding-x);
  }

  &__section-name {
    @include fontSize(18);
    font-weight: 500;
    margin-bottom: 1.25rem;
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    gap: 0.625rem;
    max-width: 250px;
    margin: 0 auto;
  }

  &__button {
    :deep(span) {
      font-weight: 500;
    }
  }

  @include adaptive(tablet-big) {
    max-width: 25rem;
    margin: 0 auto;

    &__body {
      overflow: hidden;
      max-height: var(--body-mobile-height);
      padding-bottom: 0;
      transition-property: var(--spoiler-body-transition-property);
      transition-duration: var(--spoiler-body-transition-duration);
      transition-timing-function: var(--spoiler-body-transition-tfunc);
    }
  }
}
</style>
