<template>
  <ul class="cf-checkboxes">
    <li v-for="item in filters[slug].values" class="cf-checkboxes__item">
      <AFCheckbox
        v-if="type === 'checkbox'"
        :value="item.value_slug"
        :label="item.value"
        v-model="filterValues[slug]"
      />
      <AFCheckbox
        v-if="type === 'checkbox_boolean'"
        :label="item.value"
        v-model="filterValues[slug]"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import AFCheckbox from '~/components/Blocks/FormElements/AFCheckbox.vue'
import { useCatalogStore } from '~/stores/catalogStore'

const props = defineProps<{
  slug: string
  type: 'checkbox' | 'checkbox_boolean'
}>()

const { filterValues, filters } = useCatalogStore()
</script>

<style lang="scss" scoped>
.cf-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
