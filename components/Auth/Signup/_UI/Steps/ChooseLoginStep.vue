<template>
  <div class="_popup-buttons-column">
    <AFButton label="Вход через Email" @click="toEmailStep" />
    <AFButton label="Вход через Telegram" @click="toTelegramStep" />
  </div>
</template>

<script setup lang="ts">
import AFButton from '~/components/_UI/AFButton.vue'
import { SignupSteps } from '~/domain/auth/SignupSteps'

const { signupStep, signupLoginType } = storeToRefs(useAuthStore())

function toEmailStep() {
  signupStep.value = SignupSteps.EnterLoginStep
  signupLoginType.value = 'Email'
}
function toTelegramStep() {
  signupStep.value = SignupSteps.TelegramStep
}
</script>

<style lang="scss" scoped></style>
