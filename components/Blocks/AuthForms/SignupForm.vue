<template>
  <form class="signup-form__form auth-form" @submit.prevent="onSubmit">
    <InputWrapper class="auth-form__input" type="email" :icon="UserIcon">
      <TextInput v-model="name" placeholder="Ваше имя" />
      <template v-if="errorName" #error>
        {{ errorName }}
      </template>
    </InputWrapper>
    <InputWrapper class="auth-form__input" :icon="MailIcon">
      <TextInput v-model="email" placeholder="Email" autocomplete="email" />
      <template v-if="errorEmail" #error>
        {{ errorEmail }}
      </template>
    </InputWrapper>
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
      v-model="passwordRepeat"
      placeholder="Пароль еще раз"
      autocomplete="new-password"
    >
      <template v-if="errorPasswordRepeat" #error>
        {{ errorPasswordRepeat }}
      </template>
    </PasswordInput>
    <div class="auth-form__buttons">
      <AFButton type="submit" label="Войти" :disabled="isButtonDisabled" />
    </div>
  </form>
</template>

<script setup lang="ts">
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'
import AFButton from '~/components/Blocks/AFButton.vue'
import UserIcon from '@/assets/images/icons/user.svg'
import MailIcon from '@/assets/images/icons/mail.svg'
import PasswordInput from '~/components/Blocks/FormElements/PasswordInput.vue'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import { useNotifications } from '@/composables/useNotifications'

const { $afFetch } = useNuxtApp()
const { name, email, password, passwordRepeat, dialogShown, isLoading } =
  storeToRefs(useAuthStore())
const userStore = useUserStore()
const { getUser } = userStore
const { addNotification } = useNotifications()

const { jwt } = storeToRefs(useUserStore())

const errorName = ref('')
const errorEmail = ref('')
const errorPassword = ref('')
const errorPasswordRepeat = ref('')
const validateAll = useAllValidation([
  useValidation(email, errorEmail, [
    emailValidation(),
    mustPresentValidation(),
  ]),
  useValidation(password, errorPassword, [
    passwordValidation(),
    mustPresentValidation(),
  ]),
  useValidation(passwordRepeat, errorPasswordRepeat, [
    passwordsMatchValidation(password),
  ]),
])

const isButtonDisabled = computed(
  () =>
    isLoading.value ||
    !email.value ||
    !password.value ||
    !name.value ||
    !passwordRepeat.value
)

async function onSubmit() {
  if (!validateAll.validate()) return

  isLoading.value = true

  try {
    await $afFetch('/signup', {
      method: 'POST',
      body: {
        email: email.value,
        name: name.value,
        password: password.value,
        password_confirmation: passwordRepeat.value,
      },
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
        errorName.value = response._data.errors?.name?.[0] || ''
        errorEmail.value = response._data.errors?.email?.[0] || ''
        errorPassword.value = response._data.errors?.password?.[0] || ''
      },
    })
  } catch (e) {
    console.error(e)
  }

  isLoading.value = false
}
</script>

<style lang="scss" scoped>
@import '@/scss/components/_AuthForm';

.signup-form {
  min-height: 19rem;
}
</style>
