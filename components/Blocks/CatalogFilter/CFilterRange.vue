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
          @change="updateLastChangedFilter"
        />
        <div class="cf-range__inputs-delimeter">–</div>
        <NumberInput
          class="cf-range__input"
          :min="stateMin"
          :maxFractionDigits="2"
          :max="max"
          v-model="stateMax"
          lazy
          @change="updateLastChangedFilter"
        />
      </div>
      <div class="cf-range__range">
        <InputRangeDouble
          v-model:valueMin="stateMin"
          v-model:valueMax="stateMax"
          :min="min"
          :max="max"
          @change="updateLastChangedFilter"
        />
      </div>
    </template>
    <div class="cf-range__unavailable" v-else>
      Выбор недоступен для данных фильтров
    </div>
    <CFilterApplyButton v-if="lastChangedFilter === slug" @apply="apply" />
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
  min: number
  max: number
  lastChangedFilter: string
}>()

const emit = defineEmits<{
  (e: 'apply'): void
  (e: 'update:lastChangedFilter', value: string): void
}>()

defineExpose({
  reset,
})

const slug = computed(() => props.section.slug)

const stateMin = useRouteQuery(
  `${FilterRangePrefixes.MIN}${slug.value}`,
  Math.floor(props.min),
  {
    transform: {
      get(val) {
        if (typeof val === 'string') val = Number(val)
        return val
      },
      set(val) {
        if (typeof val === 'string') val = Number(val)
        if (val < props.min) val = props.min
        if (val > stateMax.value) val = stateMax.value
        return val
      },
    },
  }
)
const stateMax = useRouteQuery(
  `${FilterRangePrefixes.MAX}${slug.value}`,
  Math.floor(props.max),
  {
    transform: {
      get(val) {
        if (typeof val === 'string') val = Number(val)
        return val
      },
      set(val) {
        if (typeof val === 'string') val = Number(val)
        if (val < stateMin.value) val = stateMin.value
        if (val > props.max) val = props.max
        return val
      },
    },
  }
)

if (stateMin.value > stateMax.value) stateMin.value = props.min

watch(() => [props.min, props.max], onFilterValuesUpdate)

function onFilterValuesUpdate() {
  if (stateMin.value < props.min) stateMin.value = props.min
  if (stateMax.value > props.max) stateMax.value = props.max
  if (stateMin.value > stateMax.value) stateMin.value = stateMax.value
}

function reset() {
  stateMin.value = props.min
  stateMax.value = props.max
}

function apply() {
  emit('apply')
}
function updateLastChangedFilter() {
  emit('update:lastChangedFilter', slug.value)
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
