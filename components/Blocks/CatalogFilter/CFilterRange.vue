<template>
  <div v-if="!!filterValues[slug]" class="cf-range">
    <div class="cf-range__inputs">
      <NumberInput
        class="cf-range__input"
        :min="Math.floor(filters[slug].min || 0)"
        :maxFractionDigits="2"
        :max="filterValues[slug].max"
        v-model="filterValues[slug][0]"
        lazy
      />
      <div class="cf-range__inputs-delimeter">–</div>
      <NumberInput
        class="cf-range__input"
        :min="filterValues[slug].min"
        :maxFractionDigits="2"
        :max="Math.floor(filters[slug].max || 0)"
        v-model="filterValues[slug][1]"
        lazy
      />
    </div>
    <div class="cf-range__range">
      <InputRangeDouble v-model="filterValues[slug]" :min="min" :max="max" />
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

  &__input {
    max-width: 6.25rem;
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
