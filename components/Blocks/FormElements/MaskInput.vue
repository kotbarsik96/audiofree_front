<template>
  <input
    class="input mask-input"
    type="text"
    :value="value"
    ref="inputEl"
    @input="($event) => onInput($event as InputEvent)"
    @focus="onFocus"
    @pointerup="onFocus"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** указать строку вида '99-aa-9a', где '9' - numReplacer, 'a' - letterReplacer */
    mask: string
    /** вместо symbolReplacer пользователь вставляет свои символы */
    numReplacer?: string
    letterReplacer?: string
    anyReplacer?: string
    modelValue: string
  }>(),
  {
    numReplacer: '9',
    letterReplacer: 'a',
    anyReplacer: '*',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: typeof props.modelValue): void
}>()

const inputEl = ref<HTMLInputElement>()

const value = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emit('update:modelValue', v)
  },
})

if (!checkMatch(value.value)) {
  value.value = props.mask
}

function onInput(event: InputEvent) {
  const target = event.target as HTMLInputElement
  const cursorPos = target.selectionStart
  if (typeof cursorPos === 'number') {
    if (event.inputType === 'deleteContentBackward') {
    } else if (event.inputType === 'deleteContentForward') {
    } else {
      const insertedSymbol = target.value[cursorPos - 1]
      const closestEmptySymbol = getClosestEmptySymbol(
        cursorPos,
        insertedSymbol
      )
      if (typeof closestEmptySymbol !== 'string') {
        target.value = props.modelValue
        return
      }
      let updatedValue = updateValue(cursorPos - 1, insertedSymbol)
      value.value = updatedValue
      target.value = updatedValue
      target.selectionStart = target.selectionEnd = cursorPos // почти...
    }
  }
}
function onFocus() {}

function getClosestEmptySymbol(
  cursorPos: number,
  symbol: string
): string | null {
  let sliced = value.value.slice(cursorPos)
  const values = [
    sliced.indexOf(props.letterReplacer),
    sliced.indexOf(props.numReplacer),
    sliced.indexOf(props.anyReplacer),
  ].filter((num) => num >= 0)

  let i = Math.min(...values)
  if (i < 0) return null

  const closestEmptySymbol = sliced[i]

  const hasNumericMismatch =
    closestEmptySymbol === props.numReplacer && !symbol.match(/\d/)
  const hasLetterMismatch =
    closestEmptySymbol === props.letterReplacer && !symbol.match(/[A-Za-z]/)
  const hasTypeMismatch = hasNumericMismatch || hasLetterMismatch
  if (hasTypeMismatch) return null

  return closestEmptySymbol
}

function updateValue(cursorPos: number, newSymbol: string): string {
  const splitted = props.modelValue.split('')
  splitted[cursorPos] = newSymbol

  let updated: string | null = splitted.join('')
  if (!checkMatch(updated)) updated = props.modelValue

  return updated
}

function checkMatch(value: string): boolean {
  /** найти первое несовпадение */
  if (value.length > props.mask.length || !value.length) return false

  const matchFailed = props.mask.split('').some((substring, index) => {
    if (typeof value[index] !== 'string') return false

    /** проверить вводимую пользователем подстроку */
    if (isOnReplacer(substring)) {
      if (isOnReplacer(value[index])) return false
      return false
    }
    /** проверить "статичную" подстроку */
    return value[index] !== props.mask[index]
  })

  return !matchFailed
}
function isOnReplacer(symbol: string) {
  return [props.letterReplacer, props.numReplacer, props.anyReplacer].includes(
    symbol
  )
}
</script>

<style lang="scss" scoped></style>
