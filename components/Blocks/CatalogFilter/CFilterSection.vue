<template>
  <div class="cf-section">
    <div class="section-name">
      {{ section.name }}
    </div>
    <div class="section-body">
      <CFilterCheckboxes
        v-if="(section.type === 'checkbox' ||section.type === 'checkbox_boolean') 
        && (section as IFilterOption).values"
        :section="(section as IFilterOption)"
        v-model:lastChangedFilter="_lastChangedFilter"
        ref="filterSectionEl"
        @apply="apply"
      />
      <CFilterRadios
        v-else-if="section.type === 'radio' && (section as IFilterOption).values"
        :section="(section as IFilterOption)"
        v-model:lastChangedFilter="_lastChangedFilter"
        ref="filterSectionEl"
        @apply="apply"
      />
      <CFilterRange
        v-else-if="section.type === 'range'"
        :section="(section as IFilterRangeItem)"
        :min="Math.floor((section as IFilterRangeItem).min ?? 0)"
        :max="Math.floor((section as IFilterRangeItem).max ?? 0)"
        ref="filterSectionEl"
        v-model:lastChangedFilter="_lastChangedFilter"
        @apply="apply"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CFilterCheckboxes from '~/components/Blocks/CatalogFilter/CFilterCheckboxes.vue'
import CFilterRadios from '~/components/Blocks/CatalogFilter/CFilterRadios.vue'
import CFilterRange from '~/components/Blocks/CatalogFilter/CFilterRange.vue'
import type {
  IFilterItem,
  IFilterOption,
  IFilterRangeItem,
} from '~/domain/product/types/IFilterItem'

const props = defineProps<{
  section: IFilterItem
  lastChangedFilter: string
}>()

const emit = defineEmits<{
  (e: 'apply'): void
  (e: 'update:lastChangedFilter', value: string): void
}>()

defineExpose({
  reset,
})

const _lastChangedFilter = computed({
  get() {
    return props.lastChangedFilter
  },
  set(value: string) {
    emit('update:lastChangedFilter', value)
  },
})

const filterSectionEl =
  ref<
    InstanceType<
      typeof CFilterCheckboxes | typeof CFilterRadios | typeof CFilterRange
    >
  >()

function apply() {
  emit('apply')
}

function reset() {
  if (typeof filterSectionEl.value?.reset === 'function') {
    filterSectionEl.value.reset()
  }
}
</script>

<style lang="scss" scoped>
.cf-section {
  border-top: 1px solid var(--stroke);
  padding: 2rem var(--padding-x);

  .section-name {
    font: var(--text-18);
    font-weight: 500;
    margin-bottom: 1.25rem;
  }
}
</style>
