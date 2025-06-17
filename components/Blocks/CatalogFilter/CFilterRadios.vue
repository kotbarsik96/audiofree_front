<template>
  <ul class="cf-radios">
    <li v-for="item in values" class="cf-option">
      <AFRadio
        :label="item.value"
        :value="item.value_slug"
        v-model="state"
        @change="updateLastChangedFilter"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import CFilterApplyButton from '~/components/Blocks/CatalogFilter/CFilterApplyButton.vue'
import AFRadio from '~/components/Blocks/FormElements/AFRadio.vue'
import type { IFilterOption } from '~/domain/product/types/IFilterItem'

const props = defineProps<{
  section: IFilterOption
}>()

defineExpose({
  reset,
})

const lastChangedFilter = inject('lastChangedFilter') as Ref<string>

const slug = computed(() => props.section.slug)
const values = computed(() => props.section.values)

const state = useRouteQuery(slug.value, values.value[0]?.value_slug)

function reset() {
  state.value = values.value[0]?.value_slug
}
function updateLastChangedFilter() {
  lastChangedFilter.value = slug.value
}
</script>

<style lang="scss" scoped>
.cf-radios {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
