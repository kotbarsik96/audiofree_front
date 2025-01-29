<template>
  <form @submit.prevent="onSubmit">
    <InputWrapper label="Логин (email, telegram)">
      <TextInput v-model="login" />
      <template v-if="loginError" #error>{{ loginError }}</template>
    </InputWrapper>
    <div class="_popup-buttons-column">
      <AFButton label="Далее" type="submit" :disabled="buttonDisabled" />
    </div>
  </form>
</template>

<script setup lang="ts">
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'
import AFButton from '~/components/Blocks/AFButton.vue'
import { LoginSteps } from '~/domain/auth/LoginSteps'

const { loginStep, login } = storeToRefs(useAuthStore())
const { $afFetch } = useNuxtApp()
const { addNotification } = useNotifications()

const isLoading = ref(false)
const loginError = ref('')

const buttonDisabled = computed(() => !login.value || isLoading.value)

watch(login, () => (loginError.value = ''))

async function onSubmit() {
  isLoading.value = true

  try {
    await $afFetch('/profile/request-login', {
      method: 'POST',
      body: {
        login: login.value,
      },
      onResponse({ response }) {
        if (isResponseOk(response.status)) {
          if (response._data.data.has_code)
            toConfirmationCodeStep(response._data.message)
          else if (response._data.data.has_password) toPasswordStep()
        }
      },
      onResponseError({ response }) {
        if (response._data.data?.has_code) {
          toConfirmationCodeStep()
        } else {
          if (response._data.message) loginError.value = response._data.message
        }
      },
    })
  } catch (e) {
    console.error(e)
  }

  isLoading.value = false
}

function toConfirmationCodeStep(message?: string) {
  loginStep.value = LoginSteps.ConfirmationCodeStep
  if (message) addNotification('info', message)
}

function toPasswordStep() {
  loginStep.value = LoginSteps.PasswordStep
}
</script>

<style lang="scss" scoped></style>
