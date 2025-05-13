<template>
  <div class="quantity-input">
    <button
      class="quantity-input__arrow quantity-input__arrow--less"
      type="button"
      aria-label="Убавить"
      @click="updateValue(-1)"
    >
      <AFIcon :icon="ChevronIcon" rotate="180deg" />
    </button>
    <input
      type="text"
      inputmode="numeric"
      class="quantity-input__input"
      :value="_value"
      @input="onInput"
      @change="onChange"
      @keyup.up="updateValue(1)"
      @keyup.down="updateValue(-1)"
      ref="inputEl"
    />
    <button
      class="quantity-input__arrow quantity-input__arrow--more"
      type="button"
      aria-label="Прибавить"
      @click="updateValue(1)"
    >
      <AFIcon :icon="ChevronIcon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import ChevronIcon from '~/assets/images/icons/chevron-right.svg'
import AFIcon from '~/components/Blocks/AFIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
  }>(),
  {
    min: 1,
    max: 99,
  }
)

const inputEl = ref<HTMLInputElement>()

const _value = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    if (typeof v !== 'number') v = 0
    v = handleMinmax(v)
    emit('update:modelValue', v)
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void
}>()

function updateValue(num: number) {
  _value.value += num
}
function getNumValue(v: string) {
  return Number(v.replace(/\D/g, '')) || 0
}
function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  let value = getNumValue(target.value)

  target.value = value.toString()
  _value.value = value
}
function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  let value = handleMinmax(getNumValue(target.value))
  target.value = value.toString()
  _value.value = value
}
function handleMinmax(value: number) {
  if (value < props.min) value = props.min
  if (value > props.max) value = props.max
  return value
}
</script>

<style lang="scss" scoped>
.quantity-input {
  border-radius: 8px;
  border: 1px solid var(--stroke);
  display: inline-flex;
  background-color: var(--white);
  overflow: hidden;

  &__arrow {
    outline-offset: -2px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.625rem;
    height: 2.625rem;
    transition: var(--general-transition);

    &:hover {
      background-color: var(--stroke);
    }

    .icon {
      width: 0.75rem;
      height: 0.75rem;
      color: var(--text-color-light);
    }
  }

  &__arrow--less {
    border-right: 1px solid var(--stroke);
  }

  &__input {
    outline-offset: -1px;
    outline-width: 1px;
    border: none;
    color: var(--text-color-light);
    width: 3.75rem;
    text-align: center;
    font: var(--text-18);
  }

  &__arrow--more {
    border-left: 1px solid var(--stroke);
  }
}
</style>
