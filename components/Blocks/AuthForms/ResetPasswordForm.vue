<template>
  <div>
    <Transition name="fade-in" mode="out-in">
      <form
        v-if="!emailSentMessage"
        class="reset-form auth-form"
        @submit.prevent="send"
      >
        <InputWrapper class="auth-form__input" :icon="MailIcon">
          <TextInput v-model="email" placeholder="Email" type="email" />
          <template v-if="emailError" #error>
            {{ emailError }}
          </template>
        </InputWrapper>
        <div class="auth-form__buttons">
          <AFButton
            type="submit"
            label="Сбросить пароль"
            :disabled="isLoading || !email"
          />
          <AFButton
            styleType="secondary"
            label="Вернуться"
            :disabled="isLoading"
            @click="tab = previousTab"
          />
        </div>
      </form>
      <div v-else class="email-sent">
        {{ emailSentMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import MailIcon from '@/assets/images/icons/mail.svg'
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'
import AFButton from '~/components/Blocks/AFButton.vue'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { previousTab, tab, email } = storeToRefs(useAuthStore())
const { addNotification } = useNotifications()

const emailSentMessage = ref()
const isLoading = ref(false)
const emailError = ref('')
const { validate, startWatching } = useValidation(email, emailError, [
  mustPresentValidation(),
  emailValidation(),
])

const { $afFetch } = useNuxtApp()

async function send() {
  startWatching()
  if (!validate()) return

  isLoading.value = true

  try {
    await $afFetch('/profile/reset-password/request', {
      method: 'POST',
      body: { email: email.value },
      onResponse({ response }) {
        if (response.ok && response._data.message) {
          emailSentMessage.value = response._data.message
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

.email-sent {
  text-align: center;
  margin: 30px auto;
  color: var(--primary);
  @include fHeadline(2);
}
</style>
