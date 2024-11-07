<template>
  <AFDialog class="auth-dialog" v-model:shown="_shown">
    <AuthWindow />
  </AFDialog>
</template>

<script setup lang="ts">
import AFDialog from "~/components/Blocks/Dialog/AFDialog.vue"
import AuthWindow from "~/components/Blocks/AuthForms/AuthWindow.vue"
import { computed, watch } from "vue"
import { storeToRefs } from "pinia"
import { useUserStore } from "@/stores/userStore"

const props = defineProps<{
  shown?: boolean
}>()

const emit = defineEmits<{
  (e: "update:shown", bool: boolean): void
}>()

const { isAuth } = storeToRefs(useUserStore())

const _shown = computed({
  get() {
    return props.shown
  },
  set(bool) {
    emit("update:shown", bool)
  },
})

watch(isAuth, () => {
  if (isAuth.value) {
    _shown.value = false
  }
})
</script>

<style lang="scss" scoped>
.auth-dialog {
  max-width: 25rem;
}
</style>
