<template>
  <ul class="cf-checkboxes">
    <li v-for="item in values" class="cf-checkboxes__item">
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
import AFCheckbox from '~/components/Blocks/FormElements/AFCheckbox.vue'
import type { IFilterItemValue } from '~/domain/product/types/IFilterItem'

const props = defineProps<{
  slug: string
  type: 'checkbox' | 'checkbox_boolean'
  values: Array<IFilterItemValue>
  modelValue: Array<string> | boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Array<string> | boolean | null): void
}>()

const state = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    if (v === false) emit('update:modelValue', null)
    else if (v === true) emit('update:modelValue', true)
    else emit('update:modelValue', v)
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
