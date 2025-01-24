<template>
  <div>
    <p>
      Для регистрации через Telegram напишите боту
      <a :href="botLink"> {{ botName }} </a>
      и нажмите "Зарегистрироваться".
    </p>
    <p>
      Если вы уже зарегистрированы, войдите
      <AFButton label="Войти по Telegram" @click="goToAuthStep" />
    </p>
  </div>
</template>

<script setup lang="ts">
import AFButton from '~/components/Blocks/AFButton.vue'

const botName = computed(() => import.meta.env.VITE_TG_BOT_NAME)
const botLink = computed(() => import.meta.env.VITE_TG_BOT_LINK)

function goToAuthStep() {}
</script>

<style lang="scss" scoped></style>
