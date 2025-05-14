<template>
  <div v-if="options.length > 0" class="catalog-sorts">
    <AFSelect :options="options" :disabled="disabled" v-model="sort" />
    <AFSelect
      :options="orderOptions"
      :disabled="disabled"
      v-model="sortOrder"
    />
  </div>
</template>

<script setup lang="ts">
import AFSelect from '~/components/Blocks/AFSelect.vue'
import { useSorts } from '~/domain/product/useSorts'
import type ISelectOption from '~/interfaces/components/ISelectOption'

const props = defineProps<{
  isFetchingProducts?: boolean
  disabled?: boolean
}>()

const { data } = await useAPI<{ data: ISelectOption[] }>(
  '/products/catalog/sorts'
)

const { options, orderOptions, sort, sortOrder } = useSorts(data)

const disabled = computed(() => props.isFetchingProducts)
</script>

<style lang="scss" scoped>
@use '/scss/mixins.scss';

.catalog-sorts {
  flex: 1 1 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.625rem;

  @include mixins.adaptive(tablet-big) {
    justify-content: center;
  }
}
</style>
