<template>
  <div class="telegram-step">
    <div>
      <p>
        Для регистрации через Telegram напишите боту
        <a class="_link" target="_blank" :href="botLink"> {{ botName }} </a>
        и нажмите "Зарегистрироваться".
      </p>
      <p>Если вы уже зарегистрированы, войдите</p>
    </div>
    <div class="_popup-buttons-column">
      <AFButton label="Войти" @click="goToAuth" />
      <AFButton label="Назад" styleType="secondary" @click="goBack" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AFButton from '~/components/Blocks/AFButton.vue'
import { SignupSteps } from '~/domain/auth/SignupSteps'

const { tab, signupStep } = storeToRefs(useAuthStore())

const botName = computed(() => import.meta.env.VITE_TG_BOT_NAME)
const botLink = computed(() => import.meta.env.VITE_TG_BOT_LINK)

function goToAuth() {
  tab.value = 'login'
}
function goBack() {
  signupStep.value = SignupSteps.ChooseLoginStep
}
</script>

<style lang="scss" scoped>
.telegram-step {
  display: flex;
  flex-direction: column;
  gap: 20px;

  > div:first-child {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
