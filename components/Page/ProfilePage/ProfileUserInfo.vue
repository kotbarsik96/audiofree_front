<template>
  <form class="section-form _section-box" @submit.prevent="onSubmit">
    <h2 class="_h2">Общая информация</h2>
    <div class="section-form__inputs">
      <InputWrapper
        class="section-form__input"
        label="Имя (фамилия, отчество)"
        inputId="username"
      >
        <TextInput v-model="username" id="username" />
        <template #error v-if="usernameError">{{ usernameError }}</template>
      </InputWrapper>
      <InputWrapper
        class="section-form__input"
        label="Телефон"
        inputId="phoneNumber"
      >
        <MaskInput
          v-model="phoneNumber"
          id="phoneNumber"
          :mask="phoneMask"
          inputmode="numeric"
        />
        <template #error v-if="phoneNumberError">{{
          phoneNumberError
        }}</template>
      </InputWrapper>
      <InputWrapper
        class="section-form__input"
        label="Населенный пункт"
        inputId="location"
      >
        <TextInput v-model="location" id="location" />
        <template #error v-if="locationError">{{ locationError }}</template>
      </InputWrapper>
      <InputWrapper class="section-form__input" label="Улица" inputId="street">
        <TextInput v-model="street" id="street" />
        <template #error v-if="streetError">{{ streetError }}</template>
      </InputWrapper>
      <InputWrapper class="section-form__input" label="Дом" inputId="house">
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
import phoneMask from '~/domain/mask-input/phoneMask'
import type IUser from '~/domain/user/types/IUser'
import {
  useValidationField,
  useValidationForm,
} from '~/domain/validaiton/useValidation'
import { phoneNumberValidation } from '~/domain/validaiton/validators/phoneNumberValidation'
import { mapErrorsFromResponse } from '~/utils/general'

const user = useSanctumUser<IUser>()

const username = ref(user.value?.name || '')
const location = ref(user.value?.location || '')
const street = ref(user.value?.street || '')
const house = ref(user.value?.house || '')

const usernameError = ref('')
const locationError = ref('')
const streetError = ref('')
const houseError = ref('')

const { $afFetch } = useNuxtApp()
const { addNotification } = useNotifications()

const form = useValidationForm({
  phoneNumber: useValidationField(user.value?.phone_number || '', [
    phoneNumberValidation(),
  ]),
})

const { phoneNumber } = form.getFieldRefs()
const { phoneNumber: phoneNumberError } = form.getErrorRefs()

const isLoading = ref(true)

const disabledSave = computed(() => {
  return (
    isLoading.value ||
    (compareValues(username.value, user.value?.name) &&
      compareValues(phoneNumber.value, user.value?.phone_number) &&
      compareValues(location.value, user.value?.location) &&
      compareValues(street.value, user.value?.street) &&
      compareValues(house.value, user.value?.house))
  )
})

function compareValues(value1: string, value2: string | null | undefined) {
  if (value1 === '' && !value2) return true
  return value1 === value2
}

onMounted(() => (isLoading.value = false))

async function onSubmit() {
  if (!form.validateAll()) return

  isLoading.value = true
  try {
    await $afFetch('/profile/edit', {
      method: 'POST',
      body: {
        name: username.value,
        phone_number: phoneNumber.value,
        location: location.value,
        street: street.value,
        house: house.value,
      },
      credentials: 'include',
      async onResponse({ response }) {
        if (response.ok) {
          addNotification('success', 'Вы успешно обновили профиль')
        }
      },
      onResponseError({ response }) {
        mapErrorsFromResponse(response, [
          ['name', usernameError],
          ['phone_number', phoneNumberError],
          ['house', houseError],
          ['location', locationError],
          ['street', streetError],
        ])
      },
    })
  } catch (err) {
    console.error(err)
  }

  isLoading.value = false
}
</script>

<style lang="scss" scoped>
@use '~/css/components/SectionForm.scss';
</style>
