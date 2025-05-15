<template>
  <div class="auth-page">
    <div class="_container">
      <div class="auth-page__box _box">
        <AuthWindow class="auth-page__form" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthWindow from '~/components/Blocks/AuthForms/AuthWindow.vue'
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import type IUser from '~/domain/user/types/IUser'

const router = useRouter()
const user = useSanctumUser<IUser>()

authWatcher()

watch(user, authWatcher)

function authWatcher() {
  if (!!user.value) router.push({ name: 'HomePage' })
}
</script>

<style lang="scss" scoped>
@use '~/scss/components/AuthForm.scss';

.auth-page {
  padding: 40px 0;

  &__box {
    overflow: hidden;
    max-width: 30rem;
    width: 100%;
    margin: 0 auto;
    padding: 0;
  }

  &__form {
    align-items: stretch;
  }
}
</style>
