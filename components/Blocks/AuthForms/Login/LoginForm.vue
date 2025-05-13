<template>
  <div class="login-form auth-form">
    <Transition name="fade-in" mode="out-in">
      <component :is="component" />
    </Transition>
    <div>
      <button class="_link" type="button" @click="goToResetPassword">
        Забыли пароль?
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loginFormComponents } from '~/domain/auth/LoginSteps'

const { tab, loginStep } = storeToRefs(useAuthStore())

const component = computed(() => loginFormComponents[loginStep.value])

function goToResetPassword() {
  tab.value = 'reset'
}
</script>

<style lang="scss" scoped>
@use '~/scss/components/AuthForm.scss';
</style>
