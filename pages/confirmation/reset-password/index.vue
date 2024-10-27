<template>
  <div class="reset-password">
    <div class="_container">
      <form class="auth-form" @submit.prevent="onSubmit">
        <PasswordInput
          class="auth-form__input"
          autocomplete="new-password"
          label="Новый пароль"
          v-model="password"
          id="new-password"
        >
          <template v-if="passwordError" #error>
            {{ passwordError }}
          </template>
        </PasswordInput>
        <PasswordInput
          class="auth-form__input"
          autocomplete="new-password"
          label="Новый пароль еще раз"
          v-model="passwordRepeat"
          id="new-password-repeat"
        >
          <template v-if="passwordRepeatError" #error>
            {{ passwordRepeatError }}
          </template>
        </PasswordInput>
        <div class="auth-form__buttons">
          <AFButton type="submit" label="Применить" :disabled="isLoading" />
        </div>
      </form>
    </div>

    <GlobalPreloader v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
import PasswordInput from '~/components/Blocks/FormElements/PasswordInput.vue'
import GlobalPreloader from '~/components/Blocks/GlobalPreloader.vue'
import AFButton from '~/components/Blocks/AFButton.vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'

const route = useRoute()
const router = useRouter()
const { addNotification } = useNotifications()

const { code, email } = route.query
const password = ref('')
const passwordRepeat = ref('')
const passwordError = ref('')
const passwordRepeatError = ref('')
const isLoading = ref(false)

const validation = useAllValidation([
  useValidation(
    password,
    passwordError,
    [mustPresentValidation(), passwordValidation()],
    { deferWatcher: true }
  ),
  useValidation(
    passwordRepeat,
    passwordRepeatError,
    [mustPresentValidation(), passwordsMatchValidation(password)],
    { deferWatcher: true }
  ),
])

const { $afFetch } = useNuxtApp()

checkLink()

async function checkLink() {
  isLoading.value = true

  try {
    await $afFetch('/profile/reset-password/verify-link', {
      method: 'POST',
      body: {
        email: email,
        code: code,
      },
      onResponse({ response }) {
        if (!response.ok) {
          router.push('/')
          addNotification('error', 'Был произведён переход по неверной ссылке')
        }
      },
    })
  } catch (e) {}

  isLoading.value = false
}
async function onSubmit() {
  if (!validation.validate()) return

  isLoading.value = true

  try {
    await $afFetch('/profile/reset-password/new-password', {
      method: 'POST',
      body: {
        code: code as string,
        email: email as string,
        password: password.value,
        password_confirmation: passwordRepeat.value,
      },
      onResponse({ response }) {
        if (response.ok) {
          addNotification('success', response._data.message)
          router.push('/')
        }
      },
      onResponseError({ response }) {
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

.reset-password {
  padding: 40px 0;

  .auth-form {
    max-width: 400px;
    margin: 0 auto;
  }
}
</style>
