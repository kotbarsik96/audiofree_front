<template>
  <div class="cf-info">
    <div
      v-for="subsection in subsections"
      :key="subsection.slug"
      class="subsection-wrap"
    >
      <CFilterInfoSubsection
        :subsection="subsection"
        @change="onFilterChange(subsection.slug)"
        ref="subsectionElements"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CFilterInfoSubsection from '~/components/Catalog/_UI/Filter/CFilterInfo/CFilterInfoSubsection.vue';
import type { IFilterInfoItem } from '~/domain/product/types/IFilterItem'

const props = defineProps<{
  section: IFilterInfoItem
}>()

defineExpose({ resetBeforeFetch })

const subsectionElements = ref<
  Array<InstanceType<typeof CFilterInfoSubsection>>
>([])

const lastChangedFilter = inject('lastChangedFilter') as Ref<string>
const refetchFilters = inject('refetchFiltersOnChange') as () => void

const subsections = computed(() => props.section.values)

function onFilterChange(slug: string) {
  lastChangedFilter.value = slug
  refetchFilters()
}

function resetBeforeFetch() {
  subsectionElements.value.forEach((component) => component.reset())
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.cf-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .subsection-wrap {
    position: relative;

    &:not(:last-child) {
      border-bottom: 1px solid var(--stroke);
      padding-block-end: 1rem;
    }
  }
}
</style>
