<template>
  <div class="profile-email section-form _section-box">
    <h2 class="_h2">Адрес электронной почты (email)</h2>
    <div class="profile-email__verify">
      <div class="profile-email__text">
        <span> Ваш текущий адрес: </span>
        <span> {{ user?.email }} </span>
      </div>
      <div
        class="profile-email__text"
        :class="{
          '--verified': emailVerified,
          '--not-verified': !emailVerified,
        }"
      >
        <p v-if="emailVerified">Почта подтверждена</p>
        <p v-else>Почта не подтверждена</p>
        <EmailIcon class="icon" />
      </div>
      <span v-if="isVerifying" class="--is-verifying">
        Вы запросили подтверждение адреса эл. почты. Вам было выслано письмо с
        ссылкой для подтверждения
      </span>
      <AFButton
        v-else-if="!emailVerified"
        label="Подтвердить адрес"
        @click="verifyEmail"
      />
    </div>
    <form @submit.prevent="onSubmit">
      <div class="section-form__inputs">
        <InputWrapper label="Новый адрес email">
          <TextInput type="email" v-model="newEmail" />
          <template v-if="newEmailError" #error>
            {{ newEmailError }}
          </template>
        </InputWrapper>
      </div>
      <AFButton label="Сохранить" type="submit" :disabled="isButtonDisabled" />
    </form>
  </div>
</template>

<script setup lang="ts">
import EmailIcon from '~/assets/images/icons/email.svg'
import AFButton from '~/components/Blocks/AFButton.vue'
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'
import type IUser from '~/domain/user/types/IUser'
import {
  useValidationField,
  useValidationForm,
} from '~/domain/validaiton/useValidation'
import { emailValidation } from '~/domain/validaiton/validators/emailValidation'
import { mustPresentValidation } from '~/domain/validaiton/validators/mustPresentValidation'

const { addNotification } = useNotifications()
const { $afFetch } = useNuxtApp()
const user = useSanctumUser<IUser>()
const { refreshIdentity } = useSanctumAuth()

const emailVerified = computed(() => !!user.value?.email_verified_at)

const isLoading = ref(false)
const isVerifying = ref(user.value?.confirmations.verify_email)

const isButtonDisabled = computed(() => isLoading.value)

const form = useValidationForm({
  newEmail: useValidationField('', [
    mustPresentValidation(),
    emailValidation(),
  ]),
})
const { newEmail } = form.getFieldRefs()
const { newEmail: newEmailError } = form.getErrorRefs()

async function onSubmit() {
  if (!form.validateAll()) return

  isLoading.value = true

  try {
    await $afFetch('/profile/change-email', {
      method: 'POST',
      body: {
        email: newEmail.value,
      },
      credentials: 'include',
      async onResponse({ response }) {
        if (response.ok) {
          addNotification('success', response._data.message)
          isVerifying.value = true
          clearAll()
        }
      },
      onResponseError({ response }) {
        mapErrorsFromResponse(response, [['email', newEmailError]])
      },
    })
  } catch (err) {
    console.error(err)
  }

  await refreshIdentity()

  isLoading.value = false
}
function clearAll() {
  newEmail.value = ''
  newEmailError.value = ''
}
async function verifyEmail() {
  await $afFetch('/profile/verification/request', {
    method: 'POST',
    credentials: 'include',
    body: {
      entity: 'email',
    },
  })
  isVerifying.value = true
}
</script>

<style lang="scss" scoped>
@use '~/css/components/SectionForm.scss';

.profile-email {
  .--verified {
    color: var(--secondary-2);
  }
  .--not-verified {
    color: var(--red);
  }
  .--is-verifying {
    color: var(--primary);
  }

  &__text {
    margin-bottom: 0.625rem;
    display: flex;
    align-items: center;
    gap: 0.625rem;

    .icon {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
  &__verify {
    margin-bottom: 1rem;
  }
}
</style>
