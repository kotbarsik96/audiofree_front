<template>
  <div class="quantity-input">
    <button
      class="quantity-input__arrow quantity-input__arrow--less"
      type="button"
      @click="updateValue(-1)"
    >
      <AFIcon :icon="ChevronIcon" rotate="180deg" />
    </button>
    <input
      type="text"
      inputmode="numeric"
      class="quantity-input__input"
      v-model="_value"
      @keyup.up="updateValue(1)"
      @keyup.down="updateValue(-1)"
    />
    <button
      class="quantity-input__arrow quantity-input__arrow--more"
      type="button"
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
    min: 0,
    max: 99,
  }
)

const _value = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    if (v < props.min) v = props.min
    if (props.max && v > props.max) v = props.max
    emit('update:modelValue', v)
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void
}>()

function updateValue(num: number) {
  _value.value += num
}
</script>

<style lang="scss" scoped>
.quantity-input {
  border-radius: 8px;
  border: 1px solid var(--stroke);
  display: flex;
  background-color: var(--white);

  &__arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.625rem;
    height: 2.625rem;

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
    color: var(--text-color-light);
    width: 3.75rem;
    text-align: center;
    @include fontSize(19);
  }

  &__arrow--more {
    border-left: 1px solid var(--stroke);
  }
}
</style>
