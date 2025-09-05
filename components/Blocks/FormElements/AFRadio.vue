<template>
  <label class="radio">
    <input type="radio" :value="value" v-model="_value" @change="onChange" />
    <span class="radio__circle"></span>
    <span v-if="label" class="radio__label">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  label?: string
  value?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void
  (e: 'change'): void
}>()

const _value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

function onChange() {
  emit('change')
}
</script>

<style lang="scss" scoped>
@use '~/css/components/AFRadio.scss';
</style>
