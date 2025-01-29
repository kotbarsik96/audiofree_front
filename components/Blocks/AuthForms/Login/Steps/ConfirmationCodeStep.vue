<template>
  <form @submit.prevent="onSubmit">
    <InputWrapper label="Код авторизации" inputId="code">
      <TextInput
        inputmode="numeric"
        placeholder="______"
        v-model="code"
        id="code"
        maxlength="6"
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
import AFButton from '~/components/Blocks/AFButton.vue'
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'
import { Auth } from '~/domain/auth/Auth'
import { LoginSteps } from '~/domain/auth/LoginSteps'

const { login, loginStep } = storeToRefs(useAuthStore())

const isLoading = ref(false)
const code = ref('')
const codeError = ref('')

const buttonDisabled = computed(() => !code.value || isLoading.value)

watch(code, () => (codeError.value = ''))

async function onSubmit() {
  isLoading.value = true

  try {
    Auth.login(login.value, 'code', code.value, codeError)
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
