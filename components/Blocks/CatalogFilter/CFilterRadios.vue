<template>
  <ul class="cf-radios">
    <li v-for="item in filters[slug].values" class="cf-radios__item">
      <AFRadio :label="item.value" :value="item.value_slug" v-model="state" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import AFRadio from '~/components/Blocks/FormElements/AFRadio.vue'
import { useProductsCatalogStore } from '~/stores/productsCatalogStore'

const props = defineProps<{
  slug: string
}>()

const state = computed({
  get() {
    return filterValues.value[props.slug]
  },
  set(v) {
    filterValues.value[props.slug] = v
  },
})

const { filterValues, filters } = storeToRefs(useProductsCatalogStore())
</script>

<style lang="scss" scoped>
.cf-radios {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
