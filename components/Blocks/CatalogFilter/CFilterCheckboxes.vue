<template>
  <ul class="cf-checkboxes">
    <li v-for="item in filtersData.filters.value[slug].values" class="cf-checkboxes__item">
      <AFCheckbox
        v-if="type === 'checkbox'"
        :value="item.value_slug"
        :label="item.value"
        v-model="state"
      />
      <AFCheckbox
        v-if="type === 'checkbox_boolean'"
        :label="item.value"
        v-model="state"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import AFCheckbox from '~/components/Blocks/FormElements/AFCheckbox.vue'
import type { IInjectFiltersData } from '~/domain/product/types/IInjectFiltersData'

const props = defineProps<{
  slug: string
  type: 'checkbox' | 'checkbox_boolean'
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
</script>

<style lang="scss" scoped>
.cf-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
