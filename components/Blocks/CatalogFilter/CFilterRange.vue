<template>
  <div v-if="!!filtersData.filterValues.value[slug]" class="cf-range">
    <div class="cf-range__inputs">
      <NumberInput
        class="cf-range__input"
        :min="Math.floor(filtersData.filters.value[slug].min || 0)"
        :maxFractionDigits="2"
        :max="filtersData.filterValues.value[slug].max"
        v-model="stateMin"
        lazy
      />
      <div class="cf-range__inputs-delimeter">–</div>
      <NumberInput
        class="cf-range__input"
        :min="filtersData.filterValues.value[slug].min"
        :maxFractionDigits="2"
        :max="Math.floor(filtersData.filters.value[slug].max || 0)"
        v-model="stateMax"
        lazy
      />
    </div>
    <div class="cf-range__range">
      <InputRangeDouble v-model="state" :min="min" :max="max" />
    </div>
  </div>
</template>

<script setup lang="ts">
import NumberInput from '~/components/Blocks/FormElements/NumberInput.vue'
import InputRangeDouble from '~/components/Blocks/InputRangeDouble.vue'
import type { IInjectFiltersData } from '~/domain/product/types/IInjectFiltersData'

const props = defineProps<{
  slug: string
  filtersData: IInjectFiltersData
}>()

const state = computed({
  get() {
    return props.filtersData.filterValues.value[props.slug]
  },
  set(v) {
    props.filtersData.updateFilters(props.slug, v)
  },
})
const stateMin = computed({
  get() {
    return state.value[0]
  },
  set(v) {
    props.filtersData.updateFilters(props.slug, [v, stateMax.value])
  },
})
const stateMax = computed({
  get() {
    return state.value[1]
  },
  set(v) {
    props.filtersData.updateFilters(props.slug, [stateMin.value, v])
  },
})

const min = computed(() =>
  Math.floor(props.filtersData.filters.value[props.slug].min as number)
)
const max = computed(() =>
  Math.floor(props.filtersData.filters.value[props.slug].max as number)
)
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
    @include fontSize(16);
  }

  &__range {
    width: 100%;
  }
}
</style>
