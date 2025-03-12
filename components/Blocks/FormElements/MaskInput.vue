<template>
  <input
    class="input mask-input"
    type="text"
    :value="value"
    ref="inputEl"
    @input="onInput"
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

async function onInput(event: Event) {
  let inputEvent = event as InputEvent
  const target = inputEvent.target as HTMLInputElement
  target.value = handleInput(target.value)

  await nextTick()
  target.selectionStart = target.selectionEnd = getCursorNewPosition(
    target.value,
    inputEvent.inputType
  )
}

function handleInput(insertedValue: string) {
  let unmaskedValue = ''

  /** получаем очищенный от маски инпут, т.е. только введённые пользователем значения */
  for (let index = 0; index < insertedValue.length; index++) {
    const symbol = insertedValue[index]

    // если текущий проверяемый символ находится на месте заменяемого символа в маске
    if (isReplacer(index)) {
      if (symbol !== props.prettyValueReplacer) unmaskedValue += symbol
    } else {
      /**  если текущий проверяемый символ находится на месте статичного символа в маске. Учитывается, что пользователь мог вставить туда свой символ */
      if (symbol !== props.mask[index]) {
        unmaskedValue += symbol
        let arr = insertedValue.split('')
        arr.splice(index, 1)
        insertedValue = arr.join('')
      }
    }
  }

  let i = 0
  let maskedValue = ''
  // собираем maskedValue, отсеивая несовпадающие по типу символы
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

  // если maskedValue собрано верно, т.е. значение совпадает с маской, сохраняем. Иначе возвращаем предыдущее значение
  if (checkMatch(maskedValue)) value.value = maskedValue
  return value.value
}
function getCursorNewPosition(value: string, inputType: string) {
  let cursorNewPos = value.indexOf(props.prettyValueReplacer)

  if (inputType === 'deleteContentBackward') {
    cursorNewPos = findLastReplaceablePosition(value) + 1
  } else {
    if (cursorNewPos < 0) cursorNewPos = value.length
  }

  return cursorNewPos
}
function findLastReplaceablePosition(str: string) {
  let lastIndex = str.length

  for (let index = 0; index < str.length; index++) {
    if (!isReplacer(index)) continue

    let symbol = str[index]
    if (symbol === props.prettyValueReplacer) continue

    lastIndex = index
  }

  return lastIndex
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
