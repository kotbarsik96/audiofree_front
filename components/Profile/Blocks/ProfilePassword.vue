<template>
  <form class="section-form _section-box" @submit.prevent="onSubmit">
    <h2 class="_h2">Сменить пароль</h2>
    <div class="section-form__inputs">
      <InputWrapper label="Текущий (старый) пароль" inputId="current-password">
        <PasswordInput
          v-model="oldPassword"
          autocomplete="current-password"
          id="current-password"
        />
        <template v-if="oldPasswordError" #error>
          {{ oldPasswordError }}
        </template>
      </InputWrapper>
      <InputWrapper label="Новый пароль" inputId="new-password">
        <PasswordInput
          v-model="newPassword"
          autocomplete="new-password"
          id="new-password"
        />
        <template v-if="newPasswordError" #error>
          {{ newPasswordError }}
        </template>
      </InputWrapper>
      <InputWrapper
        class="section-form__input --repeat"
        label="Новый пароль еще раз"
        inputId="new-password-repeat"
      >
        <PasswordInput
          v-model="newPasswordRepeat"
          autocomplete="new-password"
          id="new-password-repeat"
        />
        <template v-if="newPasswordRepeatError" #error>
          {{ newPasswordRepeatError }}
        </template>
      </InputWrapper>
    </div>
    <AFButton label="Сохранить" type="submit" :disabled="isButtonDisabled" />
  </form>
</template>

<script setup lang="ts">
import AFButton from '~/components/_UI/AFButton.vue'
import InputWrapper from '~/components/_UI/FormElements/InputWrapper.vue'
import PasswordInput from '~/components/_UI/FormElements/PasswordInput.vue'
import {
  useValidationField,
  useValidationForm,
} from '~/domain/validaiton/useValidation'
import { mustPresentValidation } from '~/domain/validaiton/validators/mustPresentValidation'
import { passwordsMatchValidation } from '~/domain/validaiton/validators/passwordsMatchValidation'
import { passwordValidation } from '~/domain/validaiton/validators/passwordValidation'
import { ServerStatuses } from '~/enums/ServerStatuses'

const { addNotification } = useNotifications()
const { $afFetch } = useNuxtApp()

const oldPassword = ref('')

const oldPasswordError = ref('')

const isLoading = ref(false)

const isButtonDisabled = computed(() => isLoading.value)

const form = useValidationForm({
  newPassword: useValidationField('', [mustPresentValidation(), passwordValidation()]),
  newPasswordRepeat: useValidationField('', []),
})

const { newPassword, newPasswordRepeat } = form.getFieldRefs()
const {
  newPassword: newPasswordError,
  newPasswordRepeat: newPasswordRepeatError,
} = form.getErrorRefs()

form.linkFields('newPassword', 'newPasswordRepeat')
form.fields.newPasswordRepeat.addValidator(passwordsMatchValidation(newPassword))

async function onSubmit() {
  if (!form.validateAll()) return

  isLoading.value = true

  try {
    await $afFetch('/profile/change-password', {
      method: 'POST',
      body: {
        current_password: oldPassword.value,
        password: newPassword.value,
        password_confirmation: newPasswordRepeat.value,
      },
      credentials: 'include',
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
        mapErrorsFromResponse(response, [
          ['current_password', oldPasswordError],
          ['password', newPasswordError],
        ])
      },
    })
  } catch (err) {
    console.error(err)
  }

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
@use '/css/mixins/mixins.scss';
@use '~/css/components/SectionForm.scss';

.section-form {
  &__input.--repeat {
    grid-column: 2 / 3;
  }

  @include mixins.adaptive(phone-big) {
    &__input.--repeat {
      grid-column: span 1;
    }
  }
}
</style>
