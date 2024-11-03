<template>
  <div>
    <div class="review-form review-form--empty _section-box">
      <button class="_link" type="button" @click="openLoginDialog">
        Войдите
      </button>
      или
      <button class="_link" type="button" @click="openSignupDialog">
        зарегистрируйтесь</button
      >, чтобы оставить отзыв
    </div>
    <form
      v-if="!!user"
      class="review-form _section-box"
      @submit.prevent="onSubmit"
    ></form>
  </div>
</template>

<script setup lang="ts">
const { user } = storeToRefs(useUserStore())
const { openSignupDialog, openLoginDialog } = useAuthStore()

function onSubmit() {}
</script>

<style lang="scss" scoped></style>
