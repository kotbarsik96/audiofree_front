<template>
  <form class="profile-userinfo _section-box">
    <h1 class="_h2">Общая информация</h1>
    <div class="profile-userinfo__inputs">
      <InputWrapper
        class="profile-userinfo__input"
        label="Имя (фамилия, отчество)"
        inputId="username"
      >
        <TextInput v-model="username" id="username" />
      </InputWrapper>
      <InputWrapper
        class="profile-userinfo__input"
        label="Населенный пункт"
        inputId="location"
      >
        <TextInput v-model="location" id="location" />
      </InputWrapper>
      <InputWrapper
        class="profile-userinfo__input"
        label="Улица"
        inputId="street"
      >
        <TextInput v-model="street" id="street" />
      </InputWrapper>
      <InputWrapper class="profile-userinfo__input" label="Дом" inputId="house">
        <TextInput v-model="house" id="house" />
      </InputWrapper>
    </div>
    <AFButton label="Сохранить" :disabled="disabledSave" />
  </form>
</template>

<script setup lang="ts">
import AFButton from '~/components/Blocks/AFButton.vue'
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const userInfo = computed(() => user.value)

const username = ref(user.value?.name || '')
const phoneNumber = ref(user.value?.phone_number || '')
const location = ref(user.value?.location || '')
const street = ref(user.value?.street || '')
const house = ref(user.value?.house || '')

const disabledSave = computed(() => {
  return (
    username.value === userInfo.value?.name &&
    // && phoneNumber.value
    location.value === userInfo.value?.location &&
    street.value === userInfo.value?.street &&
    house.value === userInfo.value?.house
  )
})
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

  @include adaptive(phone-big){
    &__inputs {
      grid-template-columns: 1fr;
    }
  }
}
</style>
