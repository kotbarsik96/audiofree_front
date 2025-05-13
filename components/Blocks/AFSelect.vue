<template>
  <div class="select" :class="{ shown }" v-click-away="close">
    <div class="select__value" @click="toggle">
      <div class="select__value-text">
        <AFIcon
          v-if="currentOption.icon"
          class="select__value-icon"
          :icon="currentOption.icon"
          :rotate="currentOption.iconRotate"
        />
        <span>{{ currentOption.label }}</span>
      </div>
      <AFIcon class="select__value-chevron" :icon="ChevronRightIcon" />
    </div>
    <Transition name="drop-down">
      <ul v-show="shown" class="select__options">
        <li
          v-for="option in _options"
          :key="option.value"
          @click="updateValue(option)"
        >
          <AFIcon
            v-if="option.icon"
            :icon="option.icon"
            :rotate="option.iconRotate"
          />
          <span> {{ option.label || option.value }} </span>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type ISelectOption from '~/interfaces/components/ISelectOption'
import ChevronRightIcon from '~/assets/images/icons/chevron-right.svg'
import vClickAway from '~/directives/vClickAway'
import AFIcon from '~/components/Blocks/AFIcon.vue'

const props = withDefaults(
  defineProps<{
    options: (string | ISelectOption)[]
    modelValue?: string | number
    placeholder?: string
  }>(),
  {
    placeholder: 'Выбрать',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void
  (e: 'update:shown', value: boolean): void
}>()

const _options = computed(() =>
  props.options.map((item) => {
    if (typeof item === 'string' || typeof item === 'number')
      return { label: item, value: item }
    return item
  })
)

const _value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
const currentOption = computed(
  () =>
    _options.value.find((opt) => opt.value === _value.value) || {
      label: props.placeholder,
      icon: undefined,
    }
)

const shown = ref(false)

function updateValue(option: ISelectOption) {
  _value.value = option.value
  close()
}
function close() {
  shown.value = false
}
function toggle() {
  shown.value = !shown.value
}
</script>

<style lang="scss" scoped>
.select {
  --select-padding: 0.625rem 0.8rem;
  --border-radius: 9px;
  --border-width: 1px;

  position: relative;
  display: inline-block;
  z-index: 50;
  border-radius: var(--border-radius);
  background-color: var(--white);
  border: var(--border-width) solid var(--input-border-color);
  font: var(--text-16);
  transition: var(--general-transition);

  &.shown {
    border-color: var(--input-border-color-active);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    z-index: 60;
  }

  &__value {
    cursor: pointer;
    padding: var(--select-padding);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.625rem;
  }

  &__value-chevron {
    width: 0.75rem;
    height: 0.75rem;
    color: inherit;
    transform: rotate(90deg);
    transition: var(--general-transition);
  }
  &.shown &__value-chevron {
    transform: rotate(-90deg);
  }

  &__value-text {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font: var(--text-16);
  }

  &__value-icon {
    width: 0.75rem;
    height: 0.75rem;
    flex-shrink: 0;
  }

  &__options {
    position: absolute;
    top: 100%;
    left: calc(var(--border-width) * -1);
    right: calc(var(--border-width) * -1);
    border: 1px solid var(--input-border-color);
    border-top: 0px;
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    background-color: var(--white);
    transition: var(--general-transition);

    li {
      cursor: pointer;
      padding: var(--select-padding);
      display: flex;
      align-items: center;
      gap: 0.625rem;
      color: var(--black);
      border-bottom: 1px solid var(--input-border-color);
      transition: var(--general-transition);

      &:hover {
        background-color: var(--stroke);
      }

      .icon {
        width: 1rem;
        height: 1rem;
        color: inherit;
        flex-shrink: 0;
      }

      &:last-child {
        border-bottom: 0;
        border-bottom-right-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
      }
    }
  }
  &.shown &__options {
    border-color: var(--input-border-color-active);
  }
}
</style>
