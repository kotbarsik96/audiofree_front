<template>
  <div class="h-auth-block">
    <AFIcon class="h-auth-block__icon" :icon="UserIcon" />
    <div class="h-auth-block__links">
      <ClientOnly>
        <div v-if="isAuth" class="h-auth-block__links-inner">
          <NuxtLink
            class="h-auth-block__btn _link _link--text-color"
            :to="{ name: 'ProfilePage' }"
            tabindex="0"
          >
            Профиль
          </NuxtLink>
          <div class="h-auth-block__delimeter">/</div>
          <button
            class="h-auth-block__btn _link _link--text-color"
            @click="Auth.logout()"
          >
            Выйти
          </button>
        </div>
        <div v-else class="h-auth-block__links-inner">
          <button
            class="h-auth-block__btn _link _link--text-color"
            type="button"
            @click="openLoginDialog"
          >
            Вход
          </button>
          <div class="h-auth-block__delimeter">/</div>
          <button
            class="h-auth-block__btn _link _link--text-color"
            type="button"
            @click="openSignupDialog"
          >
            Регистрация
          </button>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserIcon from '@/assets/images/icons/user.svg'
import AFIcon from '~/components/Blocks/AFIcon.vue'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import { Auth } from '~/domain/auth/Auth'

const { openLoginDialog, openSignupDialog } = useAuthStore()
const userStore = useUserStore()
const { isAuth } = storeToRefs(userStore)
</script>

<style lang="scss">
.h-auth-block {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  &__icon {
    font: var(--text-18);
    width: 18px;
    height: 18px;
    color: var(--primary-dark);
  }

  &__links {
    color: var(--text-color);
    font: var(--text-16);
    min-width: 8rem;
  }

  &__links-inner {
    display: flex;
    align-items: center;
  }

  &__btn {
    font: var(--text-16);
  }
}
</style>
