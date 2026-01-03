<template>
  <form @submit.prevent="onSubmit">
    <InputWrapper label="Код авторизации" inputId="code">
      <TextInput
        inputmode="numeric"
        placeholder="______"
        v-model="code"
        id="code"
        maxlength="6"
        v-autofocus
      />
      <template v-if="codeError" #error>{{ codeError }}</template>
    </InputWrapper>
    <div class="_popup-buttons-column">
      <AFButton label="Войти" type="submit" :disabled="buttonDisabled" />
      <AFButton label="Изменить логин" styleType="secondary" @click="goBack" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { vAutofocus } from '~/directives/vAutofocus'
import AFButton from '~/components/_UI/AFButton.vue'
import InputWrapper from '~/components/_UI/FormElements/InputWrapper.vue'
import TextInput from '~/components/_UI/FormElements/TextInput.vue'
import { Auth } from '~/domain/auth/Auth'
import { LoginSteps } from '~/domain/auth/LoginSteps'

const { savedLogin, loginStep } = storeToRefs(useAuthStore())

const isLoading = ref(false)
const code = ref('')
const codeError = ref('')

const buttonDisabled = computed(() => !code.value || isLoading.value)

watch(code, () => (codeError.value = ''))

async function onSubmit() {
  isLoading.value = true

  try {
    Auth.login(savedLogin.value, 'code', code.value, codeError)
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
