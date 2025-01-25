<template>
  <form @submit.prevent="onSubmit">
    <InputWrapper label="Ваше имя" inputId="name">
      <TextInput v-model="name" placeholder="Имя" id="name" />
      <template v-if="errorName" #error>{{ errorName }}</template>
    </InputWrapper>
    <InputWrapper :label="`Логин (${signupLoginType})`" inputId="login">
      <TextInput
        v-model="login"
        id="login"
        :placeholder="`${signupLoginType}`"
      />
      <template v-if="errorLogin" #error>{{ errorLogin }}</template>
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
    >
      <template v-if="errorPassword" #error>
        {{ errorPassword }}
      </template>
    </PasswordInput>
    <PasswordInput
      class="auth-form__input"
      v-model="passwordConfirmation"
      placeholder="Пароль еще раз"
      autocomplete="new-password"
    >
      <template v-if="errorPasswordConfirmation" #error>
        {{ errorPasswordConfirmation }}
      </template>
    </PasswordInput>
    <div class="_popup-buttons-column">
      <AFButton label="Регистрация" type="submit" :disabled="buttonDisabled" />
      <AFButton label="Назад" styleType="secondary" @click="goBack" />
    </div>
  </form>
</template>

<script setup lang="ts">
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'
import PasswordInput from '~/components/Blocks/FormElements/PasswordInput.vue'
import AFButton from '~/components/Blocks/AFButton.vue'
import type INuxtFetchResponse from '~/dataAccess/api/INuxtFetchResponse'
import { isResponseOk } from '~/utils/general'
import { SignupSteps } from '~/domain/auth/SignupSteps'
import { LoginSteps } from '~/domain/auth/LoginSteps'

const { $afFetch } = useNuxtApp()
const { login, signupLoginType, dialogShown, signupStep, tab, loginStep } =
  storeToRefs(useAuthStore())
const { addNotification } = useNotifications()

const isLoading = ref(false)

const userStore = useUserStore()
const { getUser } = userStore
const { jwt } = storeToRefs(userStore)

const name = ref('')
const password = ref('')
const passwordConfirmation = ref('')

const errorName = ref('')
const errorLogin = ref('')
const errorPassword = ref('')
const errorPasswordConfirmation = ref('')

const validateAll = useAllValidation([
  getLoginValidation(),
  useValidation(password, errorPassword, [passwordValidation()]),
  useValidation(passwordConfirmation, errorPasswordConfirmation, [
    passwordsMatchValidation(password),
  ]),
])

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

async function onSubmit() {
  if (!validateAll.validate()) return

  isLoading.value = true

  try {
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

  await $afFetch('/signup', {
    method: 'POST',
    body,
    async onResponse({ response }) {
      if (response._data.data) {
        jwt.value = response._data.data.token
        dialogShown.value = false
        if (response._data.message)
          addNotification('info', response._data.message)
        await nextTick()
        await getUser()
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
      validation = useValidation(login, errorLogin, [
        emailValidation(),
        mustPresentValidation(),
      ])
  }
  return validation
}

function mapResponseErrors(response: INuxtFetchResponse) {
  mapErrors(response._data.errors, [
    [signupLoginType.value, errorLogin],
    ['name', errorName],
    ['password', errorPassword],
    ['password_confirmation', errorPasswordConfirmation],
  ])
}

function goBack() {
  signupStep.value = SignupSteps.ChooseLoginStep
}
</script>

<style lang="scss" scoped></style>
