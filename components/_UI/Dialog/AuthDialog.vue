<template>
  <AFDialog class="auth-dialog" v-model:shown="_shown">
    <AuthWindow />
  </AFDialog>
</template>

<script setup lang="ts">
import AFDialog from '~/components/_UI/Dialog/AFDialog.vue';
import AuthWindow from '~/components/Auth/_UI/AuthWindow.vue'
import { computed } from 'vue'

const props = defineProps<{
  shown?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:shown', bool: boolean): void
}>()

const _shown = computed({
  get() {
    return props.shown
  },
  set(bool) {
    emit('update:shown', bool)
  },
})
</script>

<style lang="scss" scoped>
.auth-dialog {
  max-width: 25rem;
}
</style>
