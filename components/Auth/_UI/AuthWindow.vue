<template>
  <div class="auth-window">
    <Transition name="fade-in">
      <div v-if="tab !== 'reset'" class="auth-window__tabs">
        <button
          class="auth-window__tab-btn"
          :class="{ active: tab === 'login' }"
          type="button"
          @click="tab = 'login'"
        >
          Вход
        </button>
        <button
          class="auth-window__tab-btn"
          :class="{ active: tab === 'signup' }"
          type="button"
          @click="tab = 'signup'"
        >
          Регистрация
        </button>
      </div>
    </Transition>
    <div class="auth-window__body">
      <div class="auth-window__title">Авторизация</div>
      <Transition name="fade-in" mode="out-in">
        <component :is="component" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '~/components/Auth/Login/_UI/LoginForm.vue'
import ResetPasswordForm from '~/components/Auth/_UI/ResetPasswordForm.vue'
import SignupForm from '~/components/Auth/Signup/_UI/SignupForm.vue'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const { tab } = storeToRefs(useAuthStore())

const component = computed(() => {
  let _component:
    | typeof SignupForm
    | typeof LoginForm
    | typeof ResetPasswordForm

  switch (tab.value) {
    case 'login':
      _component = LoginForm
      break
    case 'signup':
      _component = SignupForm
      break
    case 'reset':
      _component = ResetPasswordForm
      break
  }

  return _component
})
</script>

<style lang="scss" scoped>
.auth-window {
  width: 100%;

  &__tabs {
    display: flex;
  }

  &__tab-btn {
    flex: 1 1 50%;
    padding: 0.6rem 1rem;
    font: var(--text-16);
    font-weight: 500;
    background-color: var(--stroke);
    color: #9a9a9a;
    outline-offset: -2px;
    transition: var(--general-transition);

    &.active {
      background-color: var(--white);
      color: var(--black);
    }
  }

  &__body {
    padding: 1rem;
  }

  &__title {
    font: var(--text-18);
    font-weight: 700;
    text-align: center;
    margin-bottom: 1rem;
  }
}
</style>
