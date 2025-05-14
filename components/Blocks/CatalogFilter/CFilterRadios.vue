<template>
  <ul class="cf-radios">
    <li v-for="item in values" class="cf-radios__item">
      <AFRadio
        :label="item.value"
        :value="item.value_slug"
        v-model="state"
        @change="updateLastChangedFilter"
      />
    </li>
    <li v-if="lastChangedFilter === slug">
      <CFilterApplyButton @apply="apply" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import CFilterApplyButton from '~/components/Blocks/CatalogFilter/CFilterApplyButton.vue'
import AFRadio from '~/components/Blocks/FormElements/AFRadio.vue'
import type { IFilterItemValue } from '~/domain/product/types/IFilterItem'

const props = defineProps<{
  slug: string
  values: Array<IFilterItemValue>
  lastChangedFilter: string
}>()

const emit = defineEmits<{
  (e: 'apply'): void
  (e: 'update:lastChangedFilter', value: string): void
}>()

defineExpose({
  reset,
})

const state = useRouteQuery(props.slug, props.values[0]?.value_slug)

function reset() {
  state.value = props.values[0]?.value_slug
}
function updateLastChangedFilter() {
  emit('update:lastChangedFilter', props.slug)
}
function apply() {
  emit('apply')
}
</script>

<style lang="scss" scoped>
.cf-radios {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
