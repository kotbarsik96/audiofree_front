<template>
  <form class="section-form _section-box" @submit.prevent="onSubmit">
    <h2 class="_h2">Сменить пароль</h2>
    <div class="section-form__inputs">
      <InputWrapper label="Текущий (старый) пароль">
        <PasswordInput v-model="oldPassword" autocomplete="current-password" />
        <template v-if="oldPasswordError" #error>
          {{ oldPasswordError }}
        </template>
      </InputWrapper>
      <InputWrapper label="Новый пароль">
        <PasswordInput v-model="newPassword" autocomplete="new-password" />
        <template v-if="newPasswordError" #error>
          {{ newPasswordError }}
        </template>
      </InputWrapper>
      <InputWrapper
        class="section-form__input --repeat"
        label="Новый пароль еще раз"
      >
        <PasswordInput
          v-model="newPasswordRepeat"
          autocomplete="new-password"
        />
      </InputWrapper>
    </div>
    <AFButton label="Сохранить" type="submit" :disabled="isButtonDisabled" />
  </form>
</template>

<script setup lang="ts">
import AFButton from '~/components/Blocks/AFButton.vue'
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import PasswordInput from '~/components/Blocks/FormElements/PasswordInput.vue'
import { ServerStatuses } from '~/enums/ServerStatuses'

const { addNotification } = useNotifications()
const { $afFetch } = useNuxtApp()

const oldPassword = ref('')
const newPassword = ref('')
const newPasswordRepeat = ref('')

const oldPasswordError = ref('')
const newPasswordError = ref('')

const isLoading = ref(false)

const isButtonDisabled = computed(() => isLoading.value)

const { validate } = useAllValidation([
  useValidation(newPassword, newPasswordError, [
    passwordValidation(),
    passwordsMatchValidation(newPassword),
  ]),
])

async function onSubmit() {
  if (!validate()) return

  isLoading.value = true

  try {
    await $afFetch('/profile/change-password', {
      method: 'POST',
      body: {
        current_password: oldPassword.value,
        password: newPassword.value,
        password_confirmation: newPasswordRepeat.value,
      },
      onResponse({ response }) {
        if (response.ok) {
          addNotification('success', response._data.message)
          clearAll()
        }
        if (response.status === ServerStatuses.UNAUTHORIZED) {
          oldPasswordError.value = 'Неверно указан пароль'
        }
      },
      onResponseError({ response }) {
        mapErrors(response._data.errors, [
          ['current_password', oldPasswordError],
          ['password', newPasswordError],
        ])
      },
    })
  } catch (err) {}

  isLoading.value = false
}
function clearAll() {
  oldPassword.value = ''
  newPassword.value = ''
  newPasswordRepeat.value = ''
  oldPasswordError.value = ''
  newPasswordError.value = ''
}
</script>

<style lang="scss" scoped>
@import '/scss/components/SectionForm';

.section-form {
  &__input.--repeat {
    grid-column: 2 / 3;
  }

  @include adaptive(phone-big) {
    &__input.--repeat {
      grid-column: span 1;
    }
  }
}
</style>
