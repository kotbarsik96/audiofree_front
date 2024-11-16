<template>
  <form class="profile-userinfo _section-box" @submit.prevent="onSubmit">
    <h1 class="_h2">Общая информация</h1>
    <div class="profile-userinfo__inputs">
      <InputWrapper
        class="profile-userinfo__input"
        label="Имя (фамилия, отчество)"
        inputId="username"
      >
        <TextInput v-model="username" id="username" />
        <template #error v-if="usernameError">{{ usernameError }}</template>
      </InputWrapper>
      <InputWrapper
        class="profile-userinfo__input"
        label="Телефон"
        inputId="username"
      >
        <MaskInput
          v-model="phoneNumber"
          id="phoneNumber"
          mask="+7 (999) 999 99 99"
          inputmode="numeric"
        />
        <template #error v-if="phoneNumberError">{{
          phoneNumberError
        }}</template>
      </InputWrapper>
      <InputWrapper
        class="profile-userinfo__input"
        label="Населенный пункт"
        inputId="location"
      >
        <TextInput v-model="location" id="location" />
        <template #error v-if="locationError">{{ locationError }}</template>
      </InputWrapper>
      <InputWrapper
        class="profile-userinfo__input"
        label="Улица"
        inputId="street"
      >
        <TextInput v-model="street" id="street" />
        <template #error v-if="streetError">{{ streetError }}</template>
      </InputWrapper>
      <InputWrapper class="profile-userinfo__input" label="Дом" inputId="house">
        <TextInput v-model="house" id="house" />
        <template #error v-if="houseError">{{ houseError }}</template>
      </InputWrapper>
    </div>
    <AFButton label="Сохранить" :disabled="disabledSave" type="submit" />
  </form>
</template>

<script setup lang="ts">
import AFButton from '~/components/Blocks/AFButton.vue'
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import MaskInput from '~/components/Blocks/FormElements/MaskInput.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const userInfo = computed(() => user.value)

const username = ref(user.value?.name || '')
const phoneNumber = ref(user.value?.phone_number || '')
const location = ref(user.value?.location || '')
const street = ref(user.value?.street || '')
const house = ref(user.value?.house || '')

const usernameError = ref('')
const phoneNumberError = ref('')
const locationError = ref('')
const streetError = ref('')
const houseError = ref('')

const { validate } = useAllValidation([
  // useValidation(username, usernameError, [])
])

const disabledSave = computed(() => {
  return (
    username.value === userInfo.value?.name &&
    // && phoneNumber.value
    location.value === userInfo.value?.location &&
    street.value === userInfo.value?.street &&
    house.value === userInfo.value?.house
  )
})

function onSubmit() {
  if (!validate()) return
}
</script>

<style lang="scss" scoped>
.profile-userinfo {
  padding: 1rem;
  max-width: 47rem;

  ._h2 {
    margin-bottom: 2rem;
  }

  &__inputs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem 1rem;
    margin-bottom: 1rem;
  }

  @include adaptive(phone-big) {
    &__inputs {
      grid-template-columns: 1fr;
    }
  }
}
</style>
