<template>
  <ul class="cf-checkboxes">
    <li v-for="item in filters[slug].values" class="cf-checkboxes__item">
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
import { useProductsCatalogStore } from '~/stores/productsCatalogStore'
import AFCheckbox from '~/components/Blocks/FormElements/AFCheckbox.vue'

const props = defineProps<{
  slug: string
  type: 'checkbox' | 'checkbox_boolean'
}>()

const { filters, filterValues } = storeToRefs(useProductsCatalogStore())

const state = computed({
  get() {
    return filterValues.value[props.slug]
  },
  set(v) {
    filterValues.value[props.slug] = v
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
