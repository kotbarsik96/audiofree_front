<template>
  <div>
    <slot v-if="isAuth"></slot>
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
const { isAuth } = storeToRefs(useUserStore())
const { openSignupDialog, openLoginDialog } = useAuthStore()
</script>

<style lang="scss" scoped>
.lts {
  padding: 10rem 0;
  font-weight: 500;
  text-align: center;
  @include fontSize(21);

  ._link {
    font: inherit;
  }
}
</style>
