<template>
  <AFButton class="apply-btn" label="Применить" type="button" @click="apply" />
</template>

<script setup lang="ts">
import AFButton from '~/components/Blocks/AFButton.vue'

const emit = defineEmits<{
  (e: 'apply'): void
}>()

function apply() {
  emit('apply')
}
</script>

<style lang="scss" scoped>
.apply-btn {
  width: 100%;
}
</style>
