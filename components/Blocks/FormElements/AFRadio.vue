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
.radio {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;

  &__label {
    @include fontSize(16);
  }

  input {
    display: none;
  }

  &__circle {
    flex-shrink: 0;
    border-radius: 50%;
    border: 1px solid var(--stroke);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    width: 1.25rem;
    height: 1.25rem;
    transition: var(--general-transition);

    &::before {
      content: "";
      width: 50%;
      height: 50%;
      opacity: 0;
      background-color: var(--primary);
      border-radius: 50%;
      transition: var(--general-transition);
    }
  }
  input:checked + &__circle {
    &::before{
      opacity: 1;
    }
  }
}
</style>
