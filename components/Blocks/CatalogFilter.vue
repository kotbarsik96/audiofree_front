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
              <div
                v-if="!!(section.slug in filterValues)"
                class="ct-filter__section-body"
              >
                <CFilterCheckboxes
                  v-if="
                    section.type === 'checkbox' ||
                    section.type === 'checkbox_boolean'
                  "
                  :type="section.type"
                  :slug="section.slug"
                />
                <CFilterRadios
                  v-else-if="section.type === 'radio'"
                  :slug="section.slug"
                />
                <CFilterRange
                  v-else-if="section.type === 'range'"
                  :slug="section.slug"
                />
              </div>
            </div>
          </div>
          <div class="ct-filter__buttons">
            <AFButton
              class="ct-filter__button"
              label="Применить фильтр"
              @click="execute"
            />
            <AFButton
              class="ct-filter__button"
              styleType="secondary"
              label="Очистить фильтр"
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
import { provide } from 'vue'
import { FiltersDataKey } from '~/domain/product/catalog/IInjectFiltersData'
import type { LocationQueryValue } from 'vue-router'

const route = useRoute()
const router = useRouter()

const bodyEl = ref<HTMLElement>()

const mobileShown = ref(false)
const bodyMobileHeight = ref('0px')

const className = computed(() => ({
  shown: mobileShown.value,
}))

watch(mobileShown, () => {
  if (mobileShown.value)
    bodyMobileHeight.value = `${bodyEl.value?.scrollHeight || 0}px`
  else bodyMobileHeight.value = '0px'
})

/** вернёт route.query, но некоторые строки распрарсит в number и boolean
 * также не будет включать в себя per_page и page
 */
const routeQueryParsed = computed(() => {
  // указать те возможные ключи в query, которые не являются slug'ами для фильтров
  const reservedKeys = ['per_page', 'page']

  let obj: Record<string, any> = {}
  Object.entries(route.query).forEach(([slug, value]) => {
    if (reservedKeys.includes(slug)) return
    obj[slug] = parseStringValue(value)
  })
  return obj
})

// значения фильтров, выставляемые пользователем
const filterValues = useState<Record<string, any>>('filter-values', () => ({}))

const { data: filtersArr, execute } = await useAPI<{ data: IFilterItem[] }>(
  `/products/catalog/update-filters`,
  {
    method: 'POST',
    body: routeQueryParsed,
    watch: false,
    async onResponse({ response }) {
      mapFiltersArrToInputs(response._data.data || [])
    },
    // onRequest({ options }) {
    //   options.body = filterValues.value
    // },
  }
)
// filtersArr, но в виде объекта, где slug каждого элемента массива - ключ
const filters = computed(() => {
  let obj: Record<string, IFilterItem> = {}
  filtersArr.value?.data.forEach((filterItem) => {
    obj[filterItem.slug] = filterItem
  })
  return obj
})

provide(FiltersDataKey, {
  filters,
  filterValues,
  updateFilters(slug: string, value: any) {
    filterValues.value[slug] = value
  },
})

watch(filterValues, updateUrlQuery, { deep: true })

function toggleShown() {
  mobileShown.value = !mobileShown.value
}
/** заполнит пустые/отсутствующие поля в filterValues данными
 * сначала попробует взять из routeQueryParsed
 * если там данных по slug'у нет, возьмёт первое значение из arr[arr.indexOf(filterItem)]
 */
function mapFiltersArrToInputs(arr: IFilterItem[]) {
  arr.forEach((filterItem) => {
    const slug = filterItem.slug

    if (
      !filterValues.value[slug] &&
      typeof filterValues.value[slug] !== 'boolean'
    ) {
      const valueInQuery = routeQueryParsed.value[slug]

      switch (filterItem.type) {
        case 'radio':
          filterValues.value[slug] =
            valueInQuery || filterItem.values[0]?.value_slug
          break
        case 'range':
          let [min, max] = getRangeValues(slug, filterItem)
          filterValues.value[slug] = [Math.floor(min), Math.floor(max)]
          break
        case 'checkbox':
          if (Array.isArray(valueInQuery))
            filterValues.value[slug] = valueInQuery
          else filterValues.value[slug] = []
          break
        case 'checkbox_boolean':
          if (typeof valueInQuery === 'boolean')
            filterValues.value[slug] = valueInQuery
          else filterValues.value[slug] = false
          break
      }
    }
  })
}
function getRangeValues(slug: string, filterItem: IFilterItem): number[] {
  let rangeValues

  const valueInQuery = routeQueryParsed.value[slug]

  // в query массив двух чисел
  if (Array.isArray(valueInQuery)) rangeValues = valueInQuery
  // в query только одно число
  else if (!!valueInQuery) {
    rangeValues = [valueInQuery, valueInQuery]
  }
  // в query нет ничего - выставить значения из фильтров
  else rangeValues = [filterItem.min || 0, filterItem.max || 0]

  // далее проверить, что не меньше min и не больше max, и не перекрывают друг друга
  if (filterItem.min && rangeValues[0] < filterItem.min)
    rangeValues[0] = filterItem.min
  if (filterItem.max && rangeValues[1] > filterItem.max)
    rangeValues[1] = filterItem.max
  if (rangeValues[0] > rangeValues[1]) rangeValues[0] = rangeValues[1]

  return rangeValues
}
/** если value - строка, пытается парсить её в false, true, Number(). При неудаче вернёт строку
 * если value - массив, проделает вышеописанное с его значениями
 */
function parseStringValue(
  value: LocationQueryValue | LocationQueryValue[]
): string | number | LocationQueryValue | LocationQueryValue[] {
  let _value: any = value

  if (typeof value === 'string') {
    if (value === 'false') _value = false
    else if (value === 'true') _value = true
    else {
      const num = Number(value)
      _value = isNaN(num) ? value : num
    }
  }
  if (Array.isArray(value))
    _value = value.map((subValue) =>
      parseStringValue(subValue)
    ) as LocationQueryValue[]

  return _value
}
function updateUrlQuery() {
  const query = toValue(filterValues)

  const slugs = Object.keys(filters.value)
  Object.entries(route.query).forEach(([key, value]) => {
    if (slugs.includes(key)) return
    query[key] = value
  })

  router.push({ name: route.name, query })
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
