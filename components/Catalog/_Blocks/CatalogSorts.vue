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
import AFSelect from '~/components/_UI/AFSelect.vue'
import { useSorts } from '~/domain/product/useSorts'
import type ISelectOption from '~/interfaces/components/ISelectOption'

const props = defineProps<{
  isFetchingProducts?: boolean
  disabled?: boolean
  sortsData: { data: ISelectOption[] } | null
}>()

const _sortsData = computed(() => props.sortsData)

const { options, orderOptions, sort, sortOrder } = useSorts(_sortsData)

const disabled = computed(() => props.isFetchingProducts)
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

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
