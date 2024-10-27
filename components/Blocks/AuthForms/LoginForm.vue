<template>
  <form class="login-form auth-form" @submit.prevent="onSubmit">
    <InputWrapper class="auth-form__input" :icon="MailIcon">
      <TextInput v-model="email" placeholder="Email" autocomplete="username" />
      <template v-if="errorEmail" #error>
        {{ errorEmail }}
      </template>
    </InputWrapper>
    <PasswordInput
      class="auth-form__input"
      autocomplete="current-password"
      v-model="password"
    >
      <template v-if="errorPassword" #error>
        {{ errorPassword }}
      </template>
    </PasswordInput>
    <div class="auth-form__buttons">
      <button
        class="_link"
        @click="tab = 'reset'"
        type="button"
        :disabled="isLoading"
      >
        Забыли пароль?
      </button>
      <AFButton
        type="submit"
        label="Войти"
        :disabled="isLoading || !email || !password"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'
import AFButton from '~/components/Blocks/AFButton.vue'
import MailIcon from '@/assets/images/icons/mail.svg'
import PasswordInput from '~/components/Blocks/FormElements/PasswordInput.vue'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useNotifications } from '@/composables/useNotifications'

const { $afFetch } = useNuxtApp()
const { tab, email, password, dialogShown } = storeToRefs(useAuthStore())
const userStore = useUserStore()
const { updateJwt, getUser } = userStore
const { addNotification } = useNotifications()

const isLoading = ref(false)

const errorEmail = ref('')
const errorPassword = ref('')

const validateAll = useAllValidation([
  useValidation(email, errorEmail, [
    emailValidation(),
    mustPresentValidation(),
  ]),
  useValidation(password, errorPassword, [mustPresentValidation()]),
])

async function onSubmit() {
  if (!validateAll.validate()) return

  isLoading.value = true

  try {
    await $afFetch('/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
      async onResponse({ response }) {
        if (response._data.data) {
          updateJwt(response._data.data.token)
          dialogShown.value = false
          if (response._data.message)
            addNotification('info', response._data.message)
          await nextTick()
          await getUser()
        }
      },
      onResponseError({ response }) {
        errorEmail.value = response._data.errors.email?.[0] || ''
        errorPassword.value = response._data.errors?.password?.[0] || ''

        if (response._data.message)
          addNotification('error', response._data.message)
      },
    })
  } catch (e) {}

  isLoading.value = false
}
</script>

<style lang="scss" scoped>
@import '@/scss/components/_AuthForm';

.login-form {
  min-height: 12rem;
}
</style>
