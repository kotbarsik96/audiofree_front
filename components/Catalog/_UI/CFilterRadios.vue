<template>
  <ul class="cf-radios">
    <li v-for="item in values" class="cf-option">
      <AFRadio
        :label="item.value"
        :value="item.value_slug"
        v-model="state"
        @change="onFilterChange"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import AFRadio from '~/components/_UI/FormElements/AFRadio.vue'
import type { IFilterOption } from '~/domain/product/types/IFilterItem'

const props = defineProps<{
  section: IFilterOption
}>()

defineExpose({
  resetBeforeFetch,
})

const lastChangedFilter = inject('lastChangedFilter') as Ref<string>
const refetchFilters = inject('refetchFiltersOnChange') as () => void

const slug = computed(() => props.section.slug)
const values = computed(() => props.section.values)

const state = useRouteQuery(slug.value, values.value[0]?.value_slug)

function resetBeforeFetch() {
  state.value = values.value[0]?.value_slug
}
function onFilterChange() {
  lastChangedFilter.value = slug.value
  refetchFilters()
}
</script>

<style lang="scss" scoped>
.cf-radios {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
