<template>
  <input
    class="input text-input"
    :type="type"
    v-model="_value"
    :autocomplete="autocomplete"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    autocomplete?: string
    type?: 'text' | 'email'
  }>(),
  {
    autocomplete: 'off',
    type: 'text',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void
}>()

const _value = computed({
  get() {
    return handleInput(props.modelValue)
  },
  set(value) {
    emit('update:modelValue', handleInput(value))
  },
})

function handleInput(value?: string) {
  return value || ''
}
</script>
