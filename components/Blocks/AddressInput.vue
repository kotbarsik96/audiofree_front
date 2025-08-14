<template>
  <InputWrapper :label="label" :input-id="inputId">
    <TextareaField
      class="oform-textarea"
      v-model="model"
      rows="2"
      :name="name"
      :id="inputId"
      maxlength="290"
      @input="onAddressInput"
      @blur="onBlur"
      @focus="onFocus"
    />
    <Transition name="fade-in">
      <SpinnerLoader v-if="isPreloaderShown" class="iw-preloader" />
    </Transition>
    <Transition name="drop-down">
      <menu
        v-if="suggestions?.length && suggestionsShown"
        class="iw-select"
        role="listbox"
      >
        <li
          v-for="addr in suggestions"
          :key="addr"
          role="option"
          @click="setAddress(addr)"
        >
          {{ addr }}
        </li>
      </menu>
    </Transition>
    <template v-if="error || validationError" #error>{{ error || validationError }}</template>
  </InputWrapper>
</template>

<script setup lang="ts">
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import TextareaField from '~/components/Blocks/FormElements/TextareaField.vue'
import SpinnerLoader from '~/components/Blocks/Loaders/SpinnerLoader.vue'
import { ServerStatuses } from '~/enums/ServerStatuses'

const props = defineProps<{
  name?: string
  inputId?: string
  label?: string
  validationError?: string
}>()

const error = ref()

const model = defineModel({ type: String })

const suggestionsShown = ref(false)
const isPreloaderShown = ref(false)

let blurTimeout: ReturnType<typeof setTimeout>

const { data, execute } = useAPI<{ data: string[] }>('search/address', {
  query: {
    value: model,
  },
  credentials: 'include',
  immediate: false,
  watch: false,
  onResponseError({ response }) {
    if (response.status === ServerStatuses.TOO_MANY_REQUESTS) {
      error.value =
        'Превышен лимит запросов. Пожалуйста, попробуйте через минуту'
    } else if (response.status === ServerStatuses.FORBIDDEN) {
      error.value =
        'Превышен общий лимит запросов. Пожалуйста, попробуйте через сутки'
    } else if (response._data.message) {
      error.value = response._data.message
    }
  },
  onResponse({ response }) {
    if (response.ok) error.value = undefined
  },
})

const suggestions = computed(() => data.value?.data)

/** При вводе пользователем адреса: поставить прелоадер, потом начать загрузку ещё через время */
const { refresh: onAddressInput } = useDelayedCallback(500, () => {
  if (!model.value?.trim()) {
    suggestionsShown.value = false
    return
  }

  refetchSuggestions()
  isPreloaderShown.value = true
})

const { refresh: refetchSuggestions } = useDelayedCallback(1000, async () => {
  await execute()
  suggestionsShown.value = true
  isPreloaderShown.value = false
})

function setAddress(address: string) {
  model.value = address
  suggestionsShown.value = false
}

function onBlur() {
  if (blurTimeout) clearTimeout(blurTimeout)
  blurTimeout = setTimeout(() => (suggestionsShown.value = false), 200)
}

function onFocus() {
  if (blurTimeout) clearTimeout(blurTimeout)
  suggestionsShown.value = true
}
</script>

<style lang="scss" scoped>
@use '/scss/mixins.scss';
</style>
