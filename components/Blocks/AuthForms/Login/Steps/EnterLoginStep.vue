<template>
  <form @submit.prevent="onSubmit">
    <InputWrapper>
      <TextInput placeholder="Логин" />
      <template v-if="loginError" #error>{{ loginError }}</template>
    </InputWrapper>
    <div class="_popup-buttons-column">
      <AFButton label="Далее" type="submit" :disabled="buttonDisabled" />
    </div>
  </form>
</template>

<script setup lang="ts">
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'
import AFButton from '~/components/Blocks/AFButton.vue'

const login = ref('')
const loginError = ref('')

const buttonDisabled = computed(() => !login.value)

async function onSubmit(){
  
}
</script>

<style lang="scss" scoped></style>
