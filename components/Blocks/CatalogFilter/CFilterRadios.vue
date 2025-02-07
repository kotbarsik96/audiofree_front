<template>
  <ul class="cf-radios">
    <li v-for="item in values" class="cf-radios__item">
      <AFRadio :label="item.value" :value="item.value_slug" v-model="state" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import AFRadio from '~/components/Blocks/FormElements/AFRadio.vue'
import type { IFilterItemValue } from '~/domain/product/types/IFilterItem'

const props = defineProps<{
  slug: string
  values: Array<IFilterItemValue>
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const state = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emit('update:modelValue', v)
  },
})
</script>

<style lang="scss" scoped>
.cf-radios {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
