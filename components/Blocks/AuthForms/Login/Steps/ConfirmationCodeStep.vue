<template>
  <form @submit.prevent="onSubmit">
    <InputWrapper>
      <TextInput inputmode="numeric" v-model="code" />
    </InputWrapper>
    <div class="_popup-buttons-column">
      <AFButton label="Регистрация" type="submit" :disabled="buttonDisabled" />
    </div>
  </form>
</template>

<script setup lang="ts">
import AFButton from '~/components/Blocks/AFButton.vue'
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'

const code = ref('')

const buttonDisabled = computed(() => !code.value)

async function onSubmit(){

}
</script>

<style lang="scss" scoped></style>
