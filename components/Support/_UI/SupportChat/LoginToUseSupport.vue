<template>
  <div class="log-in">
    <OperatorIcon class="li-icon" />
    <div class="li-body">
      <button class="_link" type="button" @click="openLoginDialog">
        Войдите
      </button>
      или
      <button class="_link" type="button" @click="openSignupDialog">
        зарегистрируйтесь
      </button>
      , чтобы связаться с тех.поддержкой
    </div>
  </div>
</template>

<script setup lang="ts">
import OperatorIcon from '~/assets/images/icons/operator.svg'

const { openSignupDialog, openLoginDialog } = useAuthStore()
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.log-in {
  display: flex;
  flex-direction: column;
  align-items: center;

  .li-icon {
    width: 4rem;
    aspect-ratio: 1;
    margin-block-end: 1rem;
  }
}
</style>
