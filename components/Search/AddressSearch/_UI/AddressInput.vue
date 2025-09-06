<template>
  <InputWrapper
    :label="label"
    :input-id="inputId"
    v-arrow-navigation="{ focusableTag: 'li' }"
    v-click-away="onClickAway"
  >
    <TextareaField
      class="oform-textarea"
      v-model="model"
      rows="2"
      :name="name"
      :id="inputId"
      maxlength="290"
      @input="onAddressInput"
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
          tabindex="0"
          @click="setAddress(addr)"
          @keyup.enter="setAddress(addr)"
        >
          {{ addr }}
        </li>
      </menu>
    </Transition>
    <template v-if="error || validationError" #error>{{
      error || validationError
    }}</template>
  </InputWrapper>
</template>

<script setup lang="ts">
import InputWrapper from '~/components/_UI/FormElements/InputWrapper.vue'
import TextareaField from '~/components/_UI/FormElements/TextareaField.vue'
import SpinnerLoader from '~/components/_UI/Loaders/SpinnerLoader.vue'
import { ServerStatuses } from '~/enums/ServerStatuses'
import { vArrowNavigation } from '~/directives/vArrowNavigation'
import vClickAway from '~/directives/vClickAway'

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

function onFocus() {
  suggestionsShown.value = true
}

function onClickAway() {
  suggestionsShown.value = false
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
</style>
