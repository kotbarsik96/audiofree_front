<template>
  <form @submit.prevent="onSubmit">
    <PasswordInput v-model="password" label="Пароль">
      <template v-if="passwordError" #error>{{ passwordError }}</template>
    </PasswordInput>
    <div class="_popup-buttons-column">
      <button
        class="_link"
        type="button"
        @click="toConfirmationStep"
        :disabled="isLoading"
      >
        Выслать код авторизации
      </button>
      <AFButton label="Войти" type="submit" :disabled="buttonDisabled" />
      <AFButton label="Изменить логин" styleType="secondary" @click="goBack" />
    </div>
  </form>
</template>

<script setup lang="ts">
import AFButton from '~/components/_UI/AFButton.vue'
import PasswordInput from '~/components/_UI/FormElements/PasswordInput.vue'
import { Auth } from '~/domain/auth/Auth'
import { LoginSteps } from '~/domain/auth/LoginSteps'

const { savedLogin, loginStep } = storeToRefs(useAuthStore())
const { $afFetch } = useNuxtApp()
const { addNotification } = useNotifications()

const login = ref(savedLogin.value)
const isLoading = ref(false)
const password = ref('')
const passwordError = ref('')

const buttonDisabled = computed(() => !password.value || isLoading.value)

watch(login, () => (savedLogin.value = login.value))

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

async function toConfirmationStep() {
  isLoading.value = true

  try {
    await $afFetch('/profile/request-login', {
      method: 'POST',
      body: {
        login: login.value,
        code_required: true,
      },
      credentials: 'include',
      onResponse({ response }) {
        if (isResponseOk(response.status)) {
          loginStep.value = LoginSteps.ConfirmationCodeStep
        }
      },
      onResponseError({ response }) {
        if (response._data.message)
          addNotification('error', response._data.message)
      },
    })
  } catch (err) {
    console.error(err)
  }

  isLoading.value = false
}
</script>

<style lang="scss" scoped></style>
