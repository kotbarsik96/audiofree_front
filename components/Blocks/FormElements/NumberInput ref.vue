<template>
  <input
    class="input number-input"
    inputmode="numeric"
    type="text"
    :value="_value"
    @input="onInput"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    min?: number // минимальное число
    max?: number // максимальное число
    maxFractionDigits?: number // количество символов после точки
    modelValue?: number | ""
  }>(),
  {
    min: 0,
    max: 999999,
  }
)

const emit = defineEmits<{
  (e: "update:modelValue", value: typeof props.modelValue): void
}>()

const _value = computed({
  get() {
    return handleInput(props.modelValue)
  },
  set(value: typeof props.modelValue) {
    emit("update:modelValue", handleInput(value))
  },
})

const _maxFractionDigits = computed(() =>
  props.maxFractionDigits && props.maxFractionDigits > 0
    ? props.maxFractionDigits
    : 0
)

/* разрешенные символы:
 * 0-9 всегда
 * если _maxFractionDigits > 0 разрешить ".",
 * если разрешен ввод отрицательных чисел, разрешить "-"
 */
const symbolsRegexp = computed(() => {
  if (props.min < 0 && props.maxFractionDigits) return /[^-0-9.]/g
  else if (props.min >= 0 && props.maxFractionDigits) return /[^0-9.]/g
  else if (props.min < 0 && !props.maxFractionDigits) return /[^-0-9]/g
  return /[^0-9]/g
})

function toNumber(num?: string) {
  if (!num) return ""
  return _maxFractionDigits.value ? parseFloat(num) : parseInt(num)
}
function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const valueString = target.value.trim()
  // прекратить обработку, если:
  // инпут начинается с "-", но разрешены отрицательные числа
  if (valueString.match(/^-$/) && props.min < 0) return
  // символ оканчивается на ".", но _maxFractionDigits > 0
  if (valueString.match(/^\d+\.$/) && _maxFractionDigits.value > 0) return

  const value = handleInput(toNumber(valueString))
  emit("update:modelValue", value)
  target.value = value.toString()
}

// обработает значение инпута при его изменении
function handleInput(value: typeof props.modelValue): "" | number {
  if (!value && value !== 0) return ""

  let result = value

  result = handleSymbols(result) as number
  if (!result && result !== 0) return ""

  result = handleMaxFractionDigits(result)
  result = handleMinMax(result)

  return result
}
// оставить только разрешенные символы (по symbolsRegexp)
function handleSymbols(value?: number) {
  const cleared = value?.toString().replace(symbolsRegexp.value, "")
  return toNumber(cleared)
}
// количество цифр после точки
function handleMaxFractionDigits(value: number) {
  if (!_maxFractionDigits.value) return value

  const valueSplit = value.toString().split(".")
  const integerStr = valueSplit[0]
  const fractionalStr = valueSplit[1]
  const fractionDigitsLength = fractionalStr?.length || 0
  // если цифр дробного числа больше, чем требуется (.548 вместо .54)
  if (fractionDigitsLength > _maxFractionDigits.value) {
    // оставить в дробной части только максимально разрешенное количество (.54)
    // (0.548).toFixed(2) покажет 0.55 вместо 0.54; поэтому необходимо указать shortenFractional напрямую
    const shortenFractional = fractionalStr.slice(0, _maxFractionDigits.value)
    return toNumber(`${integerStr}.${shortenFractional}`) as number
  }

  return value
}
// не дать ввести меньше props.min и больше props.max
function handleMinMax(value: number) {
  let moreThanMin = false
  let lessThenMax = false

  if (props.min || props.min === 0) {
    if (value >= props.min) moreThanMin = true
  }
  if (props.max || props.max === 0) {
    if (value <= props.max) lessThenMax = true
  }

  if (!moreThanMin && (props.min || props.min === 0))
    return toNumber(props.min.toFixed(_maxFractionDigits.value)) as number
  if (!lessThenMax && (props.max || props.max === 0))
    return toNumber(props.max.toFixed(_maxFractionDigits.value)) as number

  return value
}
</script>

<style lang="scss" scoped>
@import '~/scss/components/Input';
</style>
