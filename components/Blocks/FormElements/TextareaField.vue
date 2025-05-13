<template>
  <textarea class="textarea" v-model="_value"></textarea>
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

<style lang="scss" scoped>
.textarea {
  border-radius: 9px;
  border: 1px solid var(--input-border-color);
  padding: 0.7rem 1rem;
  color: var(--input-text-color);
  width: 100%;
  height: 6rem;
  outline: none;
  background-color: var(--white);
  resize: none;
  font: var(--text-16);

  &::placeholder {
    color: var(--input-placeholder-color);
  }
}
</style>
