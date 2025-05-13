<template>
  <label class="checkbox">
    <input type="checkbox" :value="value" v-model="_value" />
    <span class="checkbox__box">
      <AFIcon :icon="CheckmarkIcon" />
    </span>
    <span v-if="label" class="checkbox__label">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
import CheckmarkIcon from '~/assets/images/icons/checkmark.svg'
import AFIcon from '~/components/Blocks/AFIcon.vue'

const props = defineProps<{
  modelValue: boolean | null | string[]
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
.checkbox {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;

  &__label {
    font: var(--text-16);
  }

  input {
    display: none;
  }

  &__box {
    flex-shrink: 0;
    border-radius: 5px;
    border: 1px solid var(--stroke);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    width: 1.25rem;
    height: 1.25rem;
    transition: var(--general-transition);

    .icon {
      width: 70%;
      height: 70%;
      opacity: 0;
      color: var(--white);
      transition: var(--general-transition);
    }
  }
  input:checked + &__box {
    border-color: var(--primary);
    background-color: var(--primary);

    .icon {
      opacity: 1;
    }
  }
}
</style>
