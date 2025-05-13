<template>
  <div>
    <Transition name="fade-in" mode="out-in">
      <form
        v-if="!messageSentText"
        class="reset-form auth-form"
        @submit.prevent="send"
      >
        <InputWrapper
          class="auth-form__input"
          :label="`Логин (${possibleLogins.join(', ')})`"
          inputId="login"
        >
          <TextInput v-model="login" placeholder="Логин" id="login" />
        </InputWrapper>
        <div class="auth-form__buttons">
          <AFButton
            type="submit"
            label="Сбросить пароль"
            :disabled="isLoading || !login"
          />
          <AFButton
            styleType="secondary"
            label="Назад"
            :disabled="isLoading"
            @click="tab = previousTab"
          />
        </div>
      </form>
      <div v-else class="email-sent">
        {{ messageSentText }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'
import AFButton from '~/components/Blocks/AFButton.vue'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { possibleLogins } from '~/domain/auth/loginTypes'

const { previousTab, tab, login } = storeToRefs(useAuthStore())

const messageSentText = ref()
const isLoading = ref(false)

const { $afFetch } = useNuxtApp()

async function send() {
  isLoading.value = true

  try {
    await $afFetch('/profile/reset-password/request', {
      method: 'POST',
      body: { login: login.value },
      onResponse({ response }) {
        if (response.ok && response._data.message) {
          messageSentText.value = response._data.message
        }
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

.email-sent {
  text-align: center;
  margin: 30px auto;
  color: var(--primary);
  @include fHeadline(2);
}
</style>
