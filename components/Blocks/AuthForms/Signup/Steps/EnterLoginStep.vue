<template>
  <form @submit.prevent="onSubmit">
    <InputWrapper>
      <TextInput v-model="name" />
      <template v-if="errorName" #error>{{ errorName }}</template>
    </InputWrapper>
    <InputWrapper>
      <TextInput v-model="login" />
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

const { $afFetch } = useNuxtApp()
const { signupLoginType, dialogShown } = storeToRefs(useAuthStore())
const { addNotification } = useNotifications()

const isLoading = ref(false)

const userStore = useUserStore()
const { getUser } = userStore
const { jwt } = storeToRefs(userStore)

const name = ref('')
const login = ref('')
const password = ref('')
const passwordConfirmation = ref('')

const errorName = ref('')
const errorLogin = ref('')
const errorPassword = ref('')
const errorPasswordConfirmation = ref('')

const validateAll = useAllValidation([
  getLoginValidation(),
  useValidation(password, errorPassword, [
    passwordValidation(),
    mustPresentValidation(),
  ]),
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
    !login.value ||
    (!passwordConfirmation.value && password.value)
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
    async onResponse(response) {
      if (isResponseOk(response.response.status)) requestLogin()
    },
    onResponseError({ response }) {
      mapResponseErrors(response)
    },
  })
}

async function requestLogin() {
  await $afFetch('/profile/request-login', {
    method: 'POST',
    onResponse(response) {
      if (isResponseOk(response.response.status)) {
        
      }
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
</script>

<style lang="scss" scoped></style>
