<template>
  <div v-if="!!filterValues[slug]" class="cf-range">
    <!-- <div class="cf-range__inputs">
      <NumberInput :min="filters[slug].min" :max="filterValues[slug].max" />
      <div class="cf-range__inputs-delimeter">–</div>
      <NumberInput :min="filterValues[slug].min" :max="filters[slug].max" />
    </div> -->
    <div class="cf-range__range">
      <InputRangeDouble
        v-model:valueMin="filterValues[slug].min"
        v-model:valueMax="filterValues[slug].max"
        :min="min"
        :max="max"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import NumberInput from '~/components/Blocks/FormElements/NumberInput.vue'
import InputRangeDouble from '~/components/Blocks/InputRangeDouble.vue'
import { useCatalogStore } from '~/stores/catalogStore'
import { storeToRefs } from '#imports'

const props = defineProps<{
  slug: string
}>()

const { filterValues, filters } = storeToRefs(useCatalogStore())

const min = computed(() => Math.floor(filters.value[props.slug].min as number))
const max = computed(() => Math.floor(filters.value[props.slug].max as number))
</script>

<style lang="scss" scoped>
.cf-range {
  &__inputs {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin-bottom: 2rem;
  }

  &__inputs-delimeter {
    color: var(--black);
    @include fontSize(16);
  }

  &__range {
    width: 100%;
  }
}
</style>
