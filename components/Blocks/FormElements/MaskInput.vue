<template>
  <input
    class="input mask-input"
    type="text"
    :inputmode="mode"
    :value="value"
    @keydown="onKeydown"
    @input="onInput"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    mode?: 'text' | 'numeric'
    /** указать строку вида '+7 (___) ___ __ __', где '_' - symbolReplacer */
    mask: string
    /** вместо symbolReplacer пользователь вставляет свои символы */
    symbolReplacer?: string
    modelValue: string
    numeric?: boolean
  }>(),
  {
    mode: 'text',
    symbolReplacer: '_',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: typeof props.modelValue): void
}>()

const value = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emit('update:modelValue', v)
  },
})

const selectionStart = ref(0)
const selectionEnd = ref(0)

// if (!valueMatchesMask.value) {
//   value.value = props.mask
// }

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Backspace' || event.key === 'Delete') {
  } else {
  }
}
function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  console.log(checkMatch(target.value))
}

/** вернёт false, если проверка провалена
 *
 * вернёт true, если проверка пройдена
 * 
 * для прохождения проверки нужно, чтобы value совпадало с props.mask частично/полностью
 *  */
function checkMatch(value: string): boolean {
  /** найти первое несовпадение */
  if(value.length > props.mask.length) return false

  const matchFailed =  props.mask.split('').some((substring, index) => {
    if (typeof value[index] !== 'string') return false

    /** проверить вводимую пользователем подстроку */
    if (substring === props.symbolReplacer) {
      if (value[index] === props.symbolReplacer) return false
      else if (props.numeric && !value[index].match(/\d/)) return true
      return false
    }
    /** проверить "статичную" подстроку */
    return value[index] !== props.mask[index]
  })

  return !matchFailed
}
</script>

<style lang="scss" scoped></style>
