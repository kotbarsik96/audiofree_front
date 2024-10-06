<template>
  <div class="input-range">
    <div class="input-range__scale" @pointerdown="onPointerdown" ref="scale">
      <div class="input-range__bar" :style="barStyle"></div>
      <div
        class="input-range__thumb"
        :class="thumbClass.left"
        :style="thumbStyle.left"
        ref="thumbLeft"
      ></div>
      <div
        class="input-range__thumb"
        :class="thumbClass.right"
        :style="thumbStyle.right"
        ref="thumbRight"
      ></div>
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
}>()

const scale = ref<HTMLElement>()
const thumbLeft = ref<HTMLElement>()
const thumbRight = ref<HTMLElement>()

const _valueMin = computed({
  get() {
    return props.valueMin
  },
  set(value) {
    emit('update:valueMin', value)
  },
})
const _valueMax = computed({
  get() {
    return props.valueMax
  },
  set(value) {
    emit('update:valueMin', value)
  },
})

const scaleWidth = ref(0)

const grabbed = ref({
  left: false,
  right: false,
})

const thumbPositions = ref({
  left: 0,
  right: 0,
})

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
    left: thumbPositions.value.left,
  },
  right: {
    left: thumbPositions.value.right,
  },
}))

const barStyle = computed(() => ({
  width: `${Math.ceil(
    (scaleWidth.value / 100) *
      (thumbPositions.value.right - thumbPositions.value.left)
  )}%`,
}))

watch(
  () => props.valueMin,
  () => {
    if (_valueMin.value !== props.valueMin) _valueMin.value = props.valueMin
  }
)
watch(
  () => props.valueMax,
  () => {
    if (_valueMax.value !== props.valueMax) _valueMax.value = props.valueMax
  }
)

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

function onWindowResize() {
  updateScaleWidth()
}
function onPointerdown() {}
function updateScaleWidth() {
  if (scale.value) scaleWidth.value = scale.value.offsetWidth
  else scaleWidth.value = 0
}
</script>

<style lang="scss" scoped>
@import '~/scss/components/_InputRange';
</style>
