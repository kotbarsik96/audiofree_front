<template>
  <AFDialog
    class="confirmation"
    v-model:shown="shown"
    @animationend="onAnimationEnd"
    @animationcancel="onAnimationEnd"
  >
    <div class="confirmation__body">
      <div class="confirmation__title">
        {{ data.title }}
      </div>
      <div v-if="data.detail" class="confirmation__detail">
        {{ data.detail }}
      </div>
      <div class="confirmation__buttons">
        <AFButton :label="data.yesButtonText" @click="yes" />
        <AFButton
          :label="data.noButtonText"
          styleType="secondary"
          @click="no"
        />
      </div>
    </div>
  </AFDialog>
</template>

<script setup lang="ts">
import AFDialog from '~/components/Blocks/Dialog/AFDialog.vue'
import AFButton from '~/components/Blocks/AFButton.vue'
import type { IConfirmationCreated } from '~/composables/useConfirmation'

const props = defineProps<{
  data: IConfirmationCreated
}>()

const { removeDialog } = useConfirmation()

const shown = ref(true)

function yes() {
  props.data.resolve(true)
  shown.value = false
}
function no() {
  props.data.resolve(false)
  shown.value = false
}

function onAnimationEnd() {
  if (!shown.value) {
    removeDialog(props.data.id)
  }
}
</script>

<style lang="scss" scoped>
.confirmation {
  max-width: 500px;

  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 0.625rem 1rem;
  }

  &__title {
    @include fontSize(18);
    font-weight: 700;
    color: var(--text-color);
    text-align: center;
  }

  &__detail {
    @include fontSize(16);
    font-weight: 500;
    color: var(--text-color-light);
    text-align: center;
  }

  &__buttons {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.625rem;

    .btn {
      min-width: 100px;
    }
  }
}
</style>
