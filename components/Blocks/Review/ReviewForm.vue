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
    >
      <div class="review-form__inputs">
        
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'

const { user } = storeToRefs(useUserStore())
const { openSignupDialog, openLoginDialog } = useAuthStore()

function onSubmit() {}
</script>

<style lang="scss" scoped></style>
