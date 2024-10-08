<template>
  <div class="ct-filter" :class="className">
    <div class="ct-filter__header" @click="toggleShown">
      <div>Фильтр товаров</div>
      <AFIcon class="ct-filter__icon" :icon="FilterIcon" />
    </div>
    <div class="ct-filter__body" :style="{ height: bodyHeight }">
      <div class="ct-filter__sections">
        <div
          v-for="section in filters"
          :key="section.name"
          class="ct-filter__section"
        >
          <div class="ct-filter__section-name">
            {{ section.name }}
          </div>
          <div
            v-if="!!filterValues[section.slug]"
            class="ct-filter__section-body"
          >
            <CFilterCheckboxes
              v-if="section.type === 'checkbox'"
              :slug="section.slug"
            />
            <CFilterRadios
              v-else-if="section.type === 'radio'"
              :slug="section.slug"
            />
            <CFilterRange
              v-else-if="section.type === 'range'"
              :slug="section.slug"
            />
          </div>
        </div>
      </div>
      <AFButton class="ct-filter__button" label="Очистить фильтр" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AFButton from '~/components/Blocks/AFButton.vue'
import AFIcon from '~/components/Blocks/AFIcon.vue'
import CFilterCheckboxes from '~/components/Blocks/CatalogFilter/CFilterCheckboxes.vue'
import CFilterRadios from '~/components/Blocks/CatalogFilter/CFilterRadios.vue'
import FilterIcon from '~/assets/images/icons/filter.svg'
import CFilterRange from '~/components/Blocks/CatalogFilter/CFilterRange.vue'
import { useCatalogStore } from '~/stores/catalogStore'

const catalogStore = useCatalogStore()
const { filters, filterValues } = storeToRefs(catalogStore)

const mobileShown = ref(false)

const bodyHeight = ref('0px')

const className = computed(() => ({
  shown: mobileShown.value,
}))

await catalogStore.getFilters()

function toggleShown() {
  mobileShown.value = !mobileShown.value
}
</script>

<style lang="scss" scoped></style>
