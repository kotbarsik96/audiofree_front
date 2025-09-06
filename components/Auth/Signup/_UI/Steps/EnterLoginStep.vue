<template>
  <form @submit.prevent="onSubmit">
    <InputWrapper label="Ваше имя" inputId="name">
      <TextInput v-model="name" placeholder="Имя" id="name" :disabled="isLoading" />
      <template v-if="nameError" #error>
        {{ nameError }}
      </template>
    </InputWrapper>
    <InputWrapper :label="`Логин (${signupLoginType})`" inputId="login">
      <TextInput
        v-model="login"
        id="login"
        :placeholder="`${signupLoginType}`"
        :disabled="isLoading"
      />
      <template v-if="loginError" #error>
        {{ loginError }}
      </template>
    </InputWrapper>
    <p>
      Оставьте пустыми поля для ввода пароля, чтобы авторизоваться по
      {{ authTypeText }}
    </p>
    <PasswordInput
      class="auth-form__input"
      v-model="password"
      autocomplete="new-password"
      placeholder="Пароль"
      :disabled="isLoading"
    >
      <template v-if="passwordError" #error>
        {{ passwordError }}
      </template>
    </PasswordInput>
    <PasswordInput
      class="auth-form__input"
      v-model="passwordConfirmation"
      placeholder="Пароль еще раз"
      autocomplete="new-password"
      :disabled="isLoading"
    >
      <template v-if="passwordConfirmationError" #error>
        {{ passwordConfirmationError }}
      </template>
    </PasswordInput>
    <div class="_popup-buttons-column">
      <AFButton label="Регистрация" type="submit" :disabled="buttonDisabled" />
      <AFButton
        label="Другой способ входа"
        styleType="secondary"
        @click="goBack"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import InputWrapper from '~/components/_UI/FormElements/InputWrapper.vue'
import TextInput from '~/components/_UI/FormElements/TextInput.vue'
import PasswordInput from '~/components/_UI/FormElements/PasswordInput.vue'
import AFButton from '~/components/_UI/AFButton.vue'
import type INuxtFetchResponse from '~/dataAccess/api/INuxtFetchResponse'
import { isResponseOk } from '~/utils/general'
import { SignupSteps } from '~/domain/auth/SignupSteps'
import { LoginSteps } from '~/domain/auth/LoginSteps'
import {
  useValidationForm,
  useValidationField,
} from '~/domain/validaiton/useValidation'
import { passwordValidation } from '~/domain/validaiton/validators/passwordValidation'
import { passwordsMatchValidation } from '~/domain/validaiton/validators/passwordsMatchValidation'
import { emailValidation } from '~/domain/validaiton/validators/emailValidation'
import { mustPresentValidation } from '~/domain/validaiton/validators/mustPresentValidation'
import { Auth } from '~/domain/auth/Auth'
import type IUser from '~/domain/user/types/IUser'

const { $afFetch } = useNuxtApp()
const { savedLogin, signupLoginType, dialogShown, signupStep, tab, loginStep } =
  storeToRefs(useAuthStore())
const { addNotification } = useNotifications()

const isLoading = ref(false)

const form = useValidationForm({
  name: useValidationField<string>('', [mustPresentValidation()]),
  login: getLoginValidation(),
  password: useValidationField<string>('', [passwordValidation()]),
  passwordConfirmation: useValidationField<string>('', []),
})
form.linkFields('password', 'passwordConfirmation')
form.fields.passwordConfirmation.addValidator(
  passwordsMatchValidation(form.fields.password.value)
)

const authTypeText = computed(() => {
  let text = ''
  switch (signupLoginType.value) {
    case 'Email':
      text = 'эл. почте'
      break
  }
  return text
})

const buttonDisabled = computed(
  () =>
    isLoading.value ||
    !name.value ||
    !login.value ||
    password.value !== passwordConfirmation.value
)

const { login, name, password, passwordConfirmation } = form.getFieldRefs()
const {
  login: loginError,
  name: nameError,
  password: passwordError,
  passwordConfirmation: passwordConfirmationError,
} = form.getErrorRefs()

watch(login, () => (savedLogin.value = login.value))

async function onSubmit() {
  if (!form.validateAll()) return

  isLoading.value = true

  try {
    await Auth.requestCsrfToken()

    if (password.value) await submitWithPassword()
    else await submitWithoutPassword()
  } catch (e) {
    console.error(e)
  }

  isLoading.value = false
}

async function submitWithPassword() {
  const body: Record<string, any> = {
    [signupLoginType.value.toLowerCase()]: login.value,
    name: name.value,
    password: password.value,
    password_confirmation: passwordConfirmation.value,
  }

  const { refreshIdentity } = useSanctumAuth()

  await $afFetch('/signup', {
    method: 'POST',
    body,
    credentials: 'include',
    async onResponse({ response }) {
      if (response._data.data) {
        dialogShown.value = false
        if (response._data.message)
          addNotification('info', response._data.message)

        await Auth.requestCsrfToken()
        await refreshIdentity()
      }
    },
    onResponseError({ response }) {
      mapResponseErrors(response)
    },
  })
}

async function submitWithoutPassword() {
  const body: Record<string, any> = {
    [signupLoginType.value.toLowerCase()]: login.value,
    name: name.value,
  }

  await $afFetch('/signup', {
    method: 'POST',
    body,
    credentials: 'include',
    async onResponse({ response }) {
      if (isResponseOk(response.status)) {
        if (response._data.message)
          addNotification('success', response._data.message)
        tab.value = 'login'
        loginStep.value = LoginSteps.ConfirmationCodeStep
      }
    },
    onResponseError({ response }) {
      mapResponseErrors(response)
    },
  })
}

function getLoginValidation() {
  let validation
  switch (signupLoginType.value) {
    case 'Email':
      validation = useValidationField('', [
        emailValidation(),
        mustPresentValidation(),
      ])
  }
  return validation
}

function mapResponseErrors(response: INuxtFetchResponse) {
  mapErrorsFromResponse(response, [
    [signupLoginType.value.toLowerCase(), loginError],
    ['name', nameError],
    ['password', passwordError],
    ['password_confirmation', passwordConfirmationError],
  ])
}

function goBack() {
  signupStep.value = SignupSteps.ChooseLoginStep
}
</script>

<style lang="scss" scoped></style>
