<template>
  <label class="radio">
    <input type="radio" :value="value" v-model="_value" />
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
}>()

const _value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>

<style lang="scss" scoped>
@use '~/scss/components/AFRadio.scss';
</style>
