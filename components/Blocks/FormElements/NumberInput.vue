<template>
  <input
    class="input number-input"
    inputmode="numeric"
    type="text"
    ref="inputEl"
    :value="value"
    @input="onInteraction"
    @change="onInteraction"
    @focus="onFocus"
    @blur="onBlur"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    min?: number // минимальное число
    max?: number // максимальное число
    maxFractionDigits?: number // количество символов после точки
    modelValue: number
    lazy?: boolean
  }>(),
  {
    min: 0,
    max: 999999,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: typeof props.modelValue): void
}>()

const inputEl = ref<HTMLInputElement>()

const focused = ref(false)

const _maxFractionDigits = computed(() =>
  props.maxFractionDigits && props.maxFractionDigits > 0
    ? props.maxFractionDigits
    : 0
)

const hasOnlyMinus = ref(false)
const endsWithDot = ref(false)
const hasFraction = ref(false)
const value = computed({
  get() {
    let val = props.modelValue.toString()

    if (hasOnlyMinus.value) val = '-'
    else if (endsWithDot.value)
      val = `${props.lazy ? lastValue.value : props.modelValue}.`
    else if (props.lazy && hasFraction.value) val = lastValue.value.toString()

    return val
  },
  set(v: number | string) {
    if (typeof v === 'string') v = toNumber(v)
    emit('update:modelValue', v)
  },
})
const lastValue = ref<number>(props.modelValue)

if (props.lazy) {
  watch(
    () => props.modelValue,
    (newValue) => {
      if (lastValue.value !== newValue) lastValue.value = newValue
    }
  )
}

/* разрешенные символы:
 * 0-9 всегда
 * если разрешен ввод отрицательных чисел, разрешить "-"
 * если _maxFractionDigits > 0 разрешить ".",
 * если есть символы после точки, разрешить то количество, которое прописано в _maxFractionDigits
 */
const symbolsRegexp = computed(() => {
  const minusSign = props.min < 0 ? '-?' : ''

  const integerLength = props.max.toFixed(0).length

  let decimalRegexpPart = ''
  if (_maxFractionDigits.value > 0) {
    decimalRegexpPart += '\\.?'
    if (hasFraction.value)
      decimalRegexpPart += `\\d{0,${_maxFractionDigits.value}}`
  }

  return new RegExp(`^${minusSign}\\d{0,${integerLength}}${decimalRegexpPart}$`)
})

function onFocus() {
  focused.value = true
}
function onBlur() {
  focused.value = false
}

function onInteraction(event: Event) {
  const target = event.target as HTMLInputElement

  const handled = handleInput(target.value, event.type)
  target.value = handled.toString()

  if (!props.lazy || (props.lazy && event.type === 'change'))
    value.value = target.value
}
function toNumber(num?: string) {
  if (!num) return 0
  return _maxFractionDigits.value ? parseFloat(num) : parseInt(num)
}

/** обработает значение инпута при его изменении */
function handleInput(strValue: string, eventType: string): number {
  endsWithDot.value =
    strValue.trim().endsWith('.') && !!_maxFractionDigits.value
  hasFraction.value =
    strValue.includes('.') && !endsWithDot.value && !!_maxFractionDigits.value
  hasOnlyMinus.value = !!strValue.match(/^-$/)
  let handledValue = handleSymbols(strValue)

  if (eventType === 'change') handledValue = handleMin(handledValue)
  if (eventType === 'change') handledValue = handleMax(handledValue)

  return handledValue
}
/** оставить только разрешенные символы (по symbolsRegexp)
 * проверит входящую строку на symbolsRegexp.
 * при соответствии - оставит strValue
 * при несоответствии - вернёт последнее корректное lastValue
 */
function handleSymbols(strValue: string): number {
  const matches = strValue.match(symbolsRegexp.value)
  if (matches) lastValue.value = toNumber(strValue)
  return lastValue.value
}
function handleMin(numValue: number) {
  if (numValue < props.min) return props.min
  return numValue
}
function handleMax(numValue: number) {
  if (numValue > props.max) return props.max
  return numValue
}
</script>

<style lang="scss" scoped>
@import '~/scss/components/Input';
</style>
