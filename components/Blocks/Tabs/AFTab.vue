<template>
  <Transition name="blur">
    <div v-show="isActive" class="tab">
      <slot></slot>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  tabId: string
  currId: string
}>()

const isActive = computed(() => props.currId === props.tabId)
</script>

<style lang="scss" scoped></style>
