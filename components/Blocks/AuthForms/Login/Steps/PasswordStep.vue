<template>
  <form @submit.prevent="onSubmit">
    <PasswordInput v-model="password" label="Пароль">
      <template v-if="passwordError">{{ passwordError }}</template>
    </PasswordInput>
    <div class="_popup-buttons-column">
      <AFButton label="Войти" type="submit" :disabled="buttonDisabled" />
      <AFButton label="Назад" styleType="secondary" @click="goBack" />
    </div>
  </form>
</template>

<script setup lang="ts">
import AFButton from '~/components/Blocks/AFButton.vue'
import PasswordInput from '~/components/Blocks/FormElements/PasswordInput.vue'
import { Auth } from '~/domain/auth/Auth'
import { LoginSteps } from '~/domain/auth/LoginSteps'

const { login, loginStep } = storeToRefs(useAuthStore())

const isLoading = ref(false)
const password = ref('')
const passwordError = ref('')

const buttonDisabled = computed(() => !password.value || isLoading.value)

async function onSubmit() {
  isLoading.value = true

  try {
    await Auth.login(login.value, 'password', password.value, passwordError)
  } catch (e) {
    console.error(e)
  }

  isLoading.value = false
}

function goBack() {
  loginStep.value = LoginSteps.EnterLoginStep
}
</script>

<style lang="scss" scoped></style>
