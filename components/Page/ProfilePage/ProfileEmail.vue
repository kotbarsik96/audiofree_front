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
import {
  useValidationField,
  useValidationForm,
} from '~/domain/validaiton/useValidation'
import { emailValidation } from '~/domain/validaiton/validators/emailValidation'
import { mustPresentValidation } from '~/domain/validaiton/validators/mustPresentValidation'

const { addNotification } = useNotifications()
const { $afFetch } = useNuxtApp()
const userStore = useUserStore()
const { getUser } = userStore
const { user } = storeToRefs(userStore)

const emailVerified = computed(() => !!user.value?.email_verified_at)

const isLoading = ref(false)
const isVerifying = computed(() => user.value?.confirmations.verify_email)

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
      async onResponse({ response }) {
        if (response.ok) {
          await getUser()
          addNotification('success', response._data.message)
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

  isLoading.value = false
}
function clearAll() {
  newEmail.value = ''
  newEmailError.value = ''
}
async function verifyEmail() {
  await $afFetch('/profile/verify-email/request', {
    method: 'POST',
    async onResponse({ response }) {
      if (response.ok) {
        await getUser()
      }
    },
  })
}
</script>

<style lang="scss" scoped>
@use '~/scss/components/SectionForm.scss';

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
