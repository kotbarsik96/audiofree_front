<template>
  <div class="auth-form">
    <Transition name="fade-in" mode="out-in">
      <component :is="component" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { signupFormComponents } from '~/domain/auth/SignupSteps'

const { signupStep } = storeToRefs(useAuthStore())

const component = computed(() => signupFormComponents[signupStep.value])
</script>

<style lang="scss" scoped>
@use '~/scss/components/AuthForm.scss';
</style>
