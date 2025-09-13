<template>
  <div class="sc-input">
    <InputWrapper class="sc-iwrapper">
      <TextInput
        v-model="message"
        placeholder="Опишите проблему или задайте вопрос"
        @keyup.enter="send"
      />
      <button class="send-button" type="button" @click="send">
        <SendIcon />
      </button>
    </InputWrapper>
  </div>
</template>

<script setup lang="ts">
import InputWrapper from '~/components/_UI/FormElements/InputWrapper.vue'
import TextInput from '~/components/_UI/FormElements/TextInput.vue'
import SendIcon from '~/assets/images/icons/send.svg'

const emit = defineEmits<{
  (e: 'send'): void
}>()

const message = defineModel({ type: String })

function send() {
  emit('send')
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-input {
  padding-inline-end: var(--chat-padding-inline);

  .sc-iwrapper {
    :deep(.input-wrapper__wrap) {
      width: 100%;
      display: flex;
    }

    :deep(input) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0;
    }
  }

  .send-button {
    border: 1px solid var(--input-border-color);
    border-radius: 0 var(--input-border-radius) var(--input-border-radius) 0;
    aspect-ratio: 1;
    width: 2.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: var(--general-transition);

    svg {
      width: 1.25rem;
      aspect-ratio: 1;
      color: var(--gray-700);
    }

    &:hover {
      background-color: var(--gray-100);
    }
  }
}
</style>
