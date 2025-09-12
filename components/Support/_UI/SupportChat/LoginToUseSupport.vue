<template>
  <div class="log-in">
    <OperatorIcon />
    <button class="_link" type="button" @click="openLoginDialog">
      Войдите
    </button>
    или
    <button class="_link" type="button" @click="openSignupDialog">
      зарегистрируйтесь
    </button>
    , чтобы связаться с тех.поддержкой
  </div>
</template>

<script setup lang="ts">
import OperatorIcon from '~/assets/images/icons/operator.svg'

const { openSignupDialog, openLoginDialog } = useAuthStore()
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
</style>
