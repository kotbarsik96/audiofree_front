<template>
  <div class="cf-section" :class="classes">
    <button
      v-if="hideable"
      class="section-name"
      type="button"
      aria-label="Скрыть/раскрыть опции"
      @click="toggleBody"
    >
      <span>{{ section.name }}</span>
      <ChevronRight class="chevron" />
    </button>
    <div v-else class="section-name">
      {{ section.name }}
    </div>
    <div class="section-body" :class="bodyClasses">
      <CFilterCheckboxes
        v-if="(section.type === 'checkbox' ||section.type === 'checkbox_boolean') 
        && (section as IFilterOption).values"
        :section="(section as IFilterOption)"
        ref="filterSectionEl"
      />
      <CFilterRadios
        v-else-if="section.type === 'radio' && (section as IFilterOption).values"
        :section="(section as IFilterOption)"
        ref="filterSectionEl"
      />
      <CFilterRange
        v-else-if="section.type === 'range'"
        :section="(section as IFilterRangeItem)"
        ref="filterSectionEl"
      />
      <CFilterInfo
        v-else-if="section.type === 'info'"
        :section="(section as IFilterInfoItem)"
        ref="filterSectionEl"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CFilterInfo from '~/components/Blocks/CatalogFilter/CFilterInfo/CFilterInfo.vue'
import CFilterCheckboxes from '~/components/Blocks/CatalogFilter/CFilterCheckboxes.vue'
import CFilterRadios from '~/components/Blocks/CatalogFilter/CFilterRadios.vue'
import CFilterRange from '~/components/Blocks/CatalogFilter/CFilterRange.vue'
import ChevronRight from '~/assets/images/icons/chevron-right.svg'
import type {
  IFilterInfoItem,
  IFilterItem,
  IFilterOption,
  IFilterRangeItem,
} from '~/domain/product/types/IFilterItem'

const props = defineProps<{
  section: IFilterItem
}>()

defineExpose({
  resetBeforeFetch,
  resetAfterFetch,
})

const opened = ref(
  'values' in props.section ? props.section.values.length <= 3 : true
)
const hideable = computed(
  () =>
    ['checkbox', 'checkbox_boolean', 'info'].includes(props.section.type) &&
    'values' in props.section &&
    props.section.values.length > 3
)

const filterSectionEl =
  ref<
    InstanceType<
      typeof CFilterCheckboxes | typeof CFilterRadios | typeof CFilterRange
    >
  >()

const classes = computed(() => ({
  '--shown': opened.value,
}))

const bodyClasses = computed(() => ({
  '_hideable-element': hideable.value,
  '--shown-element': opened.value,
}))

function toggleBody() {
  opened.value = !opened.value
}

// Сброс фильтров до начала их refetch'а
function resetBeforeFetch() {
  if (
    filterSectionEl.value &&
    'resetBeforeFetch' in filterSectionEl.value &&
    typeof filterSectionEl.value?.resetBeforeFetch === 'function'
  ) {
    filterSectionEl.value.resetBeforeFetch()
  }
}
// Сброс филтьров после окончания их refetch'а
function resetAfterFetch() {
  if (
    filterSectionEl.value &&
    'resetAfterFetch' in filterSectionEl.value &&
    typeof filterSectionEl.value?.resetAfterFetch === 'function'
  ) {
    filterSectionEl.value.resetAfterFetch()
  }
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.cf-section {
  border-top: 1px solid var(--stroke);
  padding: 2rem var(--padding-x);

  .section-name {
    font: var(--text-18);
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    width: 100%;

    svg {
      width: 1.25rem;
      aspect-ratio: 1px;
      transform: rotate(90deg);
      transition: var(--general-transition);
    }
  }

  button.section-name {
    cursor: pointer;
  }

  .section-body {
    padding-block-start: 1.25rem;
  }

  &.--shown {
    .section-name {
      svg {
        transform: rotate(-90deg);
      }
    }

    .section-body {
      @include mixins.shownElementStyles;
      animation-name: showElement;
    }
  }
}
</style>
