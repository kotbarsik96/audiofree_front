<template>
  <div>
    <slot v-if="!!user"></slot>
    <div v-else class="lts _container">
      <button class="_link" type="button" @click="openLoginDialog">
        Войдите
      </button>
      или
      <button class="_link" type="button" @click="openSignupDialog">
        зарегистрируйтесь</button
      >, чтобы увидеть содержимое страницы
    </div>
  </div>
</template>

<script setup lang="ts">
import type IUser from '~/domain/user/types/IUser';

const user = useSanctumUser<IUser>()
const { openSignupDialog, openLoginDialog } = useAuthStore()
</script>

<style lang="scss" scoped>
.lts {
  padding: 10rem 0;
  text-align: center;
  font: var(--text-20);
  font-weight: 500;

  ._link {
    font: inherit;
  }
}
</style>
