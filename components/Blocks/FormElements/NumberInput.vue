<template>
  <input
    class="input number-input"
    inputmode="numeric"
    type="text"
    ref="inputEl"
    :value="value"
    @input="onInteraction"
    @change="onInteraction"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    min?: number // минимальное число
    max?: number // максимальное число
    maxFractionDigits?: number // количество символов после точки
    modelValue?: number
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

const value = ref<string>('')

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

watch(() => props.modelValue, onModelValueChange)

onMounted(() => onModelValueChange())

function onModelValueChange() {
  let str = props.modelValue?.toString() || ''
  const handled = handleInput(str, 'change')

  /** если обработанное modelValue отличается от того, что пришло,
   * обновить modelValue, что запустит onModelValueChange опять
   */
  if (handled !== str) {
    emit('update:modelValue', toNumber(handled))
    return
  }

  if (value.value !== str) {
    value.value = str
    if (inputEl.value) inputEl.value.value = str
  }
}

/** 1. в value записывает строковое значение, modelValue - всегда число
 * 2. если props.lazy == true, то modelValue обновится на событии change. Иначе - на событии input
 * 3. value.value обрабатывается вне зависимости от props.lazy
 */
function onInteraction(event: Event) {
  const target = event.target as HTMLInputElement
  value.value = handleInput(target.value, event.type)
  target.value = value.value
  if (!props.lazy || (props.lazy && event.type === 'change'))
    emit('update:modelValue', toNumber(value.value))
}
function toNumber(num?: string) {
  if (!num) return 0
  return _maxFractionDigits.value ? parseFloat(num) : parseInt(num)
}

/** обработает значение инпута при его изменении.
 * Пропустит последовательно через каждый вспомогательный метод и вернёт строку
 */
function handleInput(value: string, eventType: string): string {
  let handledValue = value

  handledValue = handleSymbols(handledValue)
  handledValue = handleMaxFractionDigits(handledValue)
  if (eventType === 'change') handledValue = handleMinMax(handledValue)

  return handledValue
}
/** оставить только разрешенные символы (по symbolsRegexp) */
function handleSymbols(value: string): string {
  // убрать точку и всё после неё, если нельзя вводить нецелые числа
  if (!_maxFractionDigits.value && value.includes('.'))
    value = value.replace(/\..+/g, '')

  let handledValue = value.replace(symbolsRegexp.value, '')
  // посимвольно отфильтрует строку только в случае необходимости
  if (needToHandleAsArray()) handledValue = handleAsArray()
  return handledValue

  function handleAsArray() {
    return handledValue
      .split('')
      .filter((s, i, arr) => {
        if (s === '.' && arr.indexOf(s) !== i) return false
        if (s === '-' && i !== 0) return false
        return true
      })
      .join('')
  }
  function needToHandleAsArray() {
    /** 1. если строка содержит "-", но не в начале, либо содержит больше одного
     * 2. если строка содержит больше одной точки
     */
    return (
      (handledValue.includes('-') &&
        (!handledValue.startsWith('-') ||
          handledValue.indexOf('-') !== handledValue.lastIndexOf('-'))) ||
      (handledValue.includes('.') &&
        handledValue.indexOf('.') !== handledValue.lastIndexOf('.'))
    )
  }
}
/** количество цифр после точки */
function handleMaxFractionDigits(value: string): string {
  if (!_maxFractionDigits.value) return value

  const valueSplit = value.split('.')
  const integerStr = valueSplit[0]
  const fractionalStr = valueSplit[1]
  const fractionDigitsLength = fractionalStr?.length || 0
  // если цифр дробного числа больше, чем требуется (.548 вместо .54)
  if (fractionDigitsLength > _maxFractionDigits.value) {
    // оставить в дробной части только максимально разрешенное количество (.54)
    // (0.548).toFixed(2) покажет 0.55 вместо 0.54; поэтому необходимо указать shortenFractional напрямую
    const shortenFractional = fractionalStr.slice(0, _maxFractionDigits.value)
    return `${integerStr}.${shortenFractional}`
  }

  return value
}
/** не дать ввести меньше props.min и больше props.max */
function handleMinMax(value: string): string {
  let valueNum = toNumber(value)
  let moreThanMin = false
  let lessThenMax = false

  if (props.min || props.min === 0) {
    if (valueNum >= props.min) moreThanMin = true
  }
  if (props.max || props.max === 0) {
    if (valueNum <= props.max) lessThenMax = true
  }

  if (!moreThanMin && (props.min || props.min === 0))
    return props.min.toFixed(_maxFractionDigits.value)
  if (!lessThenMax && (props.max || props.max === 0))
    return props.max.toFixed(_maxFractionDigits.value)

  return value
}
</script>

<style lang="scss" scoped>
@import '~/scss/components/Input';
</style>
