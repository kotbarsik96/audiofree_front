<template>
  <div class="confirmations">
    <ConfirmationDialog
      v-for="item in confirmationsList"
      :key="item.id"
      :data="item"
    />
  </div>
</template>

<script setup lang="ts">
import ConfirmationDialog from '~/components/Blocks/ConfirmationDialog.vue'
import { useConfirmation } from '~/composables/useConfirmation'

const { confirmationsList } = useConfirmation()
</script>

<style lang="scss" scoped></style>
