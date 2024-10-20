<template>
  <ul class="cf-radios">
    <li v-for="item in filters[slug].values" class="cf-radios__item">
      <AFRadio
        :label="item.value"
        :value="item.value_slug"
        v-model="state"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import AFRadio from '~/components/Blocks/FormElements/AFRadio.vue'
import { injectStrict } from '~/utils/general'
import { FiltersDataKey } from '~/domain/product/catalog/IInjectFiltersData'

const props = defineProps<{
  slug: string
}>()

const state = computed({
  get() {
    return filterValues.value[props.slug]
  },
  set(v) {
    updateFilters(props.slug, v)
  },
})

const { filterValues, filters, updateFilters } = injectStrict(FiltersDataKey)
</script>

<style lang="scss" scoped>
.cf-radios {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
