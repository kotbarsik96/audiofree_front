<template>
  <div class="cf-range">
    <template v-if="min < max">
      <div class="cf-range__inputs">
        <NumberInput
          class="cf-range__input"
          :min="min"
          :maxFractionDigits="2"
          :max="stateMax"
          v-model="stateMin"
          lazy
          @change="onFilterChange"
        />
        <div class="cf-range__inputs-delimeter">–</div>
        <NumberInput
          class="cf-range__input"
          :min="stateMin"
          :maxFractionDigits="2"
          :max="max"
          v-model="stateMax"
          lazy
          @change="onFilterChange"
        />
      </div>
      <div class="cf-range__range">
        <InputRangeDouble
          v-model:valueMin="stateMin"
          v-model:valueMax="stateMax"
          :min="min"
          :max="max"
          @change="onFilterChange"
        />
      </div>
    </template>
    <div class="cf-range__unavailable" v-else>
      Выбор недоступен для данных фильтров
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import NumberInput from '~/components/Blocks/FormElements/NumberInput.vue'
import InputRangeDouble from '~/components/Blocks/InputRangeDouble.vue'
import { FilterRangePrefixes } from '~/domain/product/types/FilterRangePrefixes'
import CFilterApplyButton from '~/components/Blocks/CatalogFilter/CFilterApplyButton.vue'
import type { IFilterRangeItem } from '~/domain/product/types/IFilterItem'

const props = defineProps<{
  section: IFilterRangeItem
}>()

defineExpose({
  resetAfterFetch,
})

const lastChangedFilter = inject('lastChangedFilter') as Ref<string>
const refetchFilters = inject('refetchFiltersOnChange') as () => void

const slug = computed(() => props.section.slug)
const min = computed(() => props.section.min ?? 0)
const max = computed(() => props.section.max ?? 0)

const stateMin = useRouteQuery(
  `${FilterRangePrefixes.MIN}${slug.value}`,
  Math.floor(min.value),
  {
    transform: {
      get(val) {
        if (typeof val === 'string') val = Number(val)
        return val
      },
      set(val) {
        if (typeof val === 'string') val = Number(val)
        if (val < min.value) val = min.value
        if (val > stateMax.value) val = stateMax.value
        return val
      },
    },
  }
)
const stateMax = useRouteQuery(
  `${FilterRangePrefixes.MAX}${slug.value}`,
  Math.floor(max.value),
  {
    transform: {
      get(val) {
        if (typeof val === 'string') val = Number(val)
        return val
      },
      set(val) {
        if (typeof val === 'string') val = Number(val)
        if (val < stateMin.value) val = stateMin.value
        if (val > max.value) val = max.value
        return val
      },
    },
  }
)

if (stateMin.value < min.value) stateMin.value = min.value
if (stateMax.value > max.value) stateMax.value = max.value

watch(() => [min.value, max.value], onFilterValuesUpdate)

function onFilterValuesUpdate() {
  if (stateMin.value < min.value) stateMin.value = min.value
  if (stateMax.value > max.value) stateMax.value = max.value
  if (stateMin.value > stateMax.value) stateMin.value = stateMax.value
}

function resetAfterFetch() {
  stateMin.value = min.value
  stateMax.value = max.value
}

function onFilterChange() {
  lastChangedFilter.value = slug.value
  refetchFilters()
}
</script>

<style lang="scss" scoped>
.cf-range {
  &__inputs {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin-bottom: 2rem;
  }

  &__input {
    max-width: 6.25rem;
  }

  &__inputs-delimeter {
    color: var(--black);
    font: var(--text-16);
  }

  &__range {
    width: 100%;
  }

  &__unavailable {
    font: var(--text-16);
    font-weight: 500;
  }

  .apply-btn {
    margin-top: 1.5rem;
  }
}
</style>
