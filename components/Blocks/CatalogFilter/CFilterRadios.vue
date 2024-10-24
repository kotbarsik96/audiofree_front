<template>
  <ul class="cf-radios">
    <li v-for="item in filtersData.filters.value[slug].values" class="cf-radios__item">
      <AFRadio :label="item.value" :value="item.value_slug" v-model="state" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import AFRadio from '~/components/Blocks/FormElements/AFRadio.vue'
import type { IInjectFiltersData } from "~/domain/product/catalog/IInjectFiltersData";

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
</script>

<style lang="scss" scoped>
.cf-radios {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
