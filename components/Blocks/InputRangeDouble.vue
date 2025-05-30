<template>
  <div class="input-range input-range--db">
    <div class="input-range__scale-wrapper">
      <div
        class="input-range__scale input-range__scale--db-range"
        @pointerdown="onPointerdown"
        ref="scale"
      >
        <div class="input-range__bar" :style="barStyle"></div>
        <div
          class="input-range__thumb"
          :class="thumbClass.left"
          :style="thumbStyle.left"
          ref="thumbLeft"
        ></div>
        <div
          class="input-range__thumb input-range__thumb--right"
          :class="thumbClass.right"
          :style="thumbStyle.right"
          ref="thumbRight"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getCoords } from '~/utils/getCoords'

const props = defineProps<{
  valueMin: number
  valueMax: number
  min: number
  max: number
}>()

const emit = defineEmits<{
  (emit: 'update:valueMin', value: number): void
  (emit: 'update:valueMax', value: number): void
  (emit: 'change'): void
}>()

const scale = ref<HTMLElement>()
const thumbLeft = ref<HTMLElement>()
const thumbRight = ref<HTMLElement>()

const _valueMin = computed({
  get() {
    return props.valueMin
  },
  set(value) {
    emit('update:valueMin', handleValue(value))
  },
})
const _valueMax = computed({
  get() {
    return props.valueMax
  },
  set(value) {
    emit('update:valueMax', handleValue(value))
  },
})
/** числовое значение 100% */
const coverage = computed(() => props.max - props.min)
/** сдвиг до начала ползунка */
const shift = computed(() => props.min / (coverage.value / 100))

/** от ширины шкалы зависит размер заполняющей её полоски и положения ползунков
 * поэтому это значение обновляется при событии resize у window
 */
const scaleWidth = ref(0)

const grabbed = ref({
  left: false,
  right: false,
})

const thumbPositions = computed(() => ({
  left: _valueMin.value / (coverage.value / 100) - shift.value,
  right: _valueMax.value / (coverage.value / 100) - shift.value,
}))
const thumbClass = computed(() => ({
  left: {
    grabbed: grabbed.value.left,
  },
  right: {
    grabbed: grabbed.value.right,
  },
}))
const thumbStyle = computed(() => ({
  left: {
    left: `${thumbPositions.value.left}%`,
  },
  right: {
    left: `${thumbPositions.value.right}%`,
  },
}))

const barStyle = computed(() => ({
  width: `${Math.ceil(
    thumbPositions.value.right - thumbPositions.value.left
  )}%`,
  left: `${thumbPositions.value.left}%`,
}))

// проверить корректность новых значений
watch(_valueMin, () => {
  if (_valueMin.value < props.min) _valueMin.value = props.min
  if (_valueMin.value > _valueMax.value) _valueMin.value = _valueMax.value
})
watch(_valueMax, () => {
  if (_valueMax.value > props.max) _valueMax.value = props.max
  if (_valueMax.value < _valueMin.value) _valueMax.value = _valueMin.value
})

onMounted(() => {
  if (scale.value) scale.value.ondragstart = () => false
  if (thumbLeft.value) thumbLeft.value.ondragstart = () => false
  if (thumbRight.value) thumbRight.value.ondragstart = () => false

  onWindowResize()
  window.addEventListener('resize', onWindowResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
})

function handleValue(value: number) {
  return Math.floor(value)
}

function onWindowResize() {
  updateScaleWidth()
}
function updateScaleWidth() {
  if (scale.value) scaleWidth.value = scale.value.offsetWidth
  else scaleWidth.value = 0
}

function getClosestThumb(coord: number): 'left' | 'right' {
  let closestThumb: 'left' | 'right' = 'left'
  const percent = coord / (scaleWidth.value / 100)

  if (
    thumbPositions.value.right - percent <=
    percent - thumbPositions.value.left
  )
    closestThumb = 'right'

  return closestThumb
}
function moveThumb(thumbToMove: 'left' | 'right', toCoord: number) {
  const percent = toCoord / (scaleWidth.value / 100) + shift.value
  let nextValue = (coverage.value / 100) * percent
  if (nextValue < props.min) nextValue = props.min
  if (nextValue > props.max) nextValue = props.max

  switch (thumbToMove) {
    case 'left':
      _valueMin.value = nextValue
      break
    case 'right':
      _valueMax.value = nextValue
      break
  }
}
function onPointerdown(event: PointerEvent) {
  if (!scale.value) return

  event.preventDefault()

  const startPosition = event.clientX - getCoords(scale.value).left
  const closestThumb = getClosestThumb(startPosition)

  moveThumb(closestThumb, startPosition)
  document.addEventListener('pointerup', onPointerUp)
  document.addEventListener('pointermove', onPointerMove)

  function onPointerMove(moveEvent: PointerEvent) {
    if (!scale.value) return

    const nextPosition = moveEvent.clientX - getCoords(scale.value).left
    moveThumb(closestThumb, nextPosition)
  }
  function onPointerUp() {
    document.removeEventListener('pointerup', onPointerUp)
    document.removeEventListener('pointermove', onPointerMove)
    
    emit('change')
  }
}
</script>

<style lang="scss" scoped>
@use '~/scss/components/InputRange.scss';
</style>
