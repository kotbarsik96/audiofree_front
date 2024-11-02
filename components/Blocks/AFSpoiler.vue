<template>
  <div class="spoiler" :class="className">
    <button class="spoiler__head" type="button" @click="toggle">
      <span>
        <slot name="head"></slot>
      </span>
      <span class="spoiler__icon"></span>
    </button>
    <div class="spoiler__body" :style="style" ref="spoilerBodyEl">
      <div class="spoiler__body-inner">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const spoilerBodyEl = ref<HTMLElement>()
const spoilerBodyHeight = ref(0)

const shown = ref(false)

const style = computed(() => ({
  maxHeight: shown.value ? `${spoilerBodyHeight.value}px` : 0,
}))
const className = computed(() => ({
  '--shown': shown.value,
}))

onMounted(() => {
  updateSpoilerBodyHeight()
  window.addEventListener('resize', onResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

function onResize() {
  updateSpoilerBodyHeight()
}
function updateSpoilerBodyHeight() {
  if (!spoilerBodyEl.value) {
    spoilerBodyHeight.value = 0
    return
  }
  spoilerBodyHeight.value = spoilerBodyEl.value.scrollHeight
}
function toggle() {
  shown.value = !shown.value
}
function show() {
  shown.value = true
}
function hide() {
  shown.value = false
}
</script>

<style lang="scss" scoped>
.spoiler {
  &__head {
    width: 100%;
    padding: 20px 30px;
    border-radius: 8px;
    background-color: var(--white);
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include fontSize(19);
    font-weight: 700;
    color: var(--text-color);
    position: relative;
    z-index: 20;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.15);
    transition: var(--general-transition);
  }

  &__icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 15px;
      height: 4px;
      background-color: var(--primary);
      display: inline-block;
      transition: var(--general-transition);
    }

    &::after {
      transform: rotate(90deg);
    }
  }
  &.--shown &__icon {
    &::before {
      opacity: 0;
    }
    &::after {
      transform: rotate(0deg);
    }
  }

  &__body {
    position: relative;
    top: -5px;
    z-index: 10;
    overflow: hidden;
    background-color: var(--white);
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.15);
    transition: max-height 0.25s ease-in-out;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  &__body-inner {
    padding: 20px 0;
  }
}
</style>
