<template>
  <input
    class="input mask-input"
    type="text"
    :value="value"
    ref="inputEl"
    @input="onInput"
    @focus="onFocus"
    @pointerup="onFocus"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** указать строку вида '99-aa-9a', где '9' - numReplacer, 'a' - letterReplacer */
    mask: string
    numReplacer?: string
    letterReplacer?: string
    anyReplacer?: string
    modelValue: string
    prettyValueReplacer?: string
  }>(),
  {
    numReplacer: '9',
    letterReplacer: 'a',
    anyReplacer: '*',
    prettyValueReplacer: '_',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: typeof props.modelValue): void
}>()

const letterRegexp = /[A-Za-z]/
const numberRegexp = /\d/

const inputEl = ref<HTMLInputElement>()

const value = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emit('update:modelValue', v)
  },
})

const prettyMask = computed(() => {
  const regexp = new RegExp(
    `[${props.letterReplacer}${props.numReplacer}${props.anyReplacer}]`,
    'g'
  )

  return props.mask.replace(regexp, props.prettyValueReplacer)
})

if (!checkMatch(value.value)) {
  value.value = prettyMask.value
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  target.value = handleInput(target.value)
}
function onFocus() {}

function handleInput(insertedValue: string) {
  let unmaskedValue = insertedValue
    .split('')
    .filter((_, index) => isReplacer(index))
    .join('')

  let i = 0
  let maskedValue = ''
  props.mask.split('').forEach((maskSymbol, index) => {
    let insertingSymbol = unmaskedValue[i]
    if (isReplacer(index)) {
      if (insertingSymbol) {
        /** цикл будет удалять символы из unmaskedValue до тех пор, пока они не проходят проверку на тип */
        while (
          !!insertingSymbol &&
          hasTypeMismatch(insertingSymbol, maskSymbol)
        ) {
          let splitted = unmaskedValue.split('')
          splitted.splice(i, 1)
          unmaskedValue = splitted.join('')
          insertingSymbol = unmaskedValue[i]
        }

        if (insertingSymbol) maskedValue += insertingSymbol
        else maskedValue += props.prettyValueReplacer

        i++
      } else maskedValue += props.prettyValueReplacer
    } else {
      maskedValue += maskSymbol
    }
  })

  if (checkMatch(maskedValue)) value.value = maskedValue
  return value.value
}

function hasTypeMismatch(insertingSymbol: string, replacer: string) {
  let hasMismatch = false

  switch (replacer) {
    case props.letterReplacer:
      if (!insertingSymbol.match(letterRegexp)) hasMismatch = true
      break
    case props.numReplacer:
      if (!insertingSymbol.match(numberRegexp)) hasMismatch = true
      break
  }

  return hasMismatch
}

function checkMatch(value: string): boolean {
  if (value.trim().length < 1) return false

  const hasMismatch = props.mask.split('').some((symbol, index) => {
    if (isReplacer(index)) {
      if (value[index] === props.prettyValueReplacer) return false
      return hasTypeMismatch(value[index], symbol)
    } else {
      return symbol !== value[index]
    }
  })

  return !hasMismatch
}
/** проверяет, что переданный symbol является заменяемым
 *
 * предполагается, что symbol взят из props.mask
 */
function isReplacer(index: number) {
  return prettyMask.value[index] === props.prettyValueReplacer
}
</script>

<style lang="scss" scoped></style>
