<template>
  <ul class="cf-radios">
    <li v-for="item in filters[slug].values" class="cf-radios__item">
      <AFRadio
        :label="item.value"
        :value="item.value_slug"
        v-model="filterValues[slug]"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import AFRadio from '~/components/Blocks/FormElements/AFRadio.vue'
import { useCatalogStore } from '~/stores/catalogStore'

const props = defineProps<{
  slug: string
}>()

const { filterValues, filters } = useCatalogStore()
</script>

<style lang="scss" scoped>
.cf-radios {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
