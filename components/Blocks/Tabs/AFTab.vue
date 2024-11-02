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
}>()

const activeTabTitle = injectStrict<Ref<string>>(TabTitleInjection)
const isActive = computed(() => activeTabTitle.value === props.title)
</script>

<style lang="scss" scoped></style>
