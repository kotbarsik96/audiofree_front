<template>
  <div class="input-wrapper" :class="className">
    <label v-if="label" class="input-wrapper__label" :for="inputId">
      {{ label }}
    </label>
    <div class="input-wrapper__wrap">
      <AFIcon v-if="icon" class="input-wrapper__icon" :icon="icon" />
      <slot />
    </div>
    <div v-if="typeof symbols === 'number'" class="input-wrapper__counter">
      <span> {{ symbols }} </span>
      <span v-if="_maxlength > 0"> / {{ _maxlength }} </span>
    </div>
    <Transition name="drop-down">
      <span v-if="slots.error" class="input-wrapper__error _error">
        <slot name="error" />
      </span>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import AFIcon from '~/components/Blocks/AFIcon.vue'
import { computed } from 'vue'
import { useSlots } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    inputId?: string
    icon?: string | any
    iconPos?: 'right' | 'left'
    rounded?: boolean
    maxlength?: number | string
    symbols?: number
  }>(),
  {
    iconPos: 'left',
  }
)
const slots = useSlots()

const _maxlength = computed(() =>
  props.maxlength ? Number(props.maxlength) : 0
)

const className = computed(() => {
  return {
    'input-wrapper--icon-left': props.iconPos === 'left',
    'input-wrapper--rounded': props.rounded,
  }
})
</script>

<style lang="scss" scoped>
.input-wrapper {
  --input-icon-size: 1.25rem;
  --input-padding-x: 1rem;
  --input-padding-y: 0.6rem;
  --input-icon-padding: 1rem;
  --input-w-icon-padding: calc(
    var(--input-padding-x) + var(--input-icon-padding) +
      calc(var(--input-icon-size) / 1.5)
  );

  position: relative;
  margin-bottom: 0.25rem;

  @include fontSize(14);

  &__label {
    cursor: pointer;
    display: inline-block;
    @include fontSize(12);
    font-weight: 500;
  }

  &__wrap {
    position: relative;
  }

  &__icon {
    position: absolute;
    right: var(--input-icon-padding);
    top: 50%;
    transform: translateY(-50%);
    color: var(--primary);
    width: var(--input-icon-size);
    height: var(--input-icon-size);
    transition: var(--general-transition);
  }
  &__icon + :deep(.input) {
    padding-right: var(--input-w-icon-padding);
  }
  &--icon-left &__icon + :deep(.input) {
    padding-right: var(--input-padding-x);
    padding-left: var(--input-w-icon-padding);
  }

  &--icon-left &__icon {
    right: auto;
    left: var(--input-icon-padding);
  }

  &:has(._error) :deep(.input),
  &:has(._error) :deep(.textarea) {
    border-color: var(--red);
  }
  &:has(._error) &__icon {
    color: var(--red);
  }

  :deep(.input),
  :deep(.textarea) {
    border-radius: 9px;
    border: 1px solid #dadada;
    background-color: transparent;
    padding: var(--input-padding-y) var(--input-padding-x);
    outline: none;
    width: 100%;
    color: var(--text-color);
    transition: var(--general-transition);
    @include fontSize(14);
  }
  :deep(.input)::placeholder,
  :deep(.textarea)::placeholder {
    color: #b9b9b9;
  }

  &--rounded :deep(.input),
  &--rounded :deep(.textarea) {
    border-radius: 23px;
  }

  &__counter {
    position: absolute;
    right: 0;
    bottom: -1rem;
  }

  &__error {
    display: block;
    margin-bottom: -1rem;
    max-width: 100%;
  }
  &__counter + &__error {
    padding-right: 5rem;
  }
}
</style>
