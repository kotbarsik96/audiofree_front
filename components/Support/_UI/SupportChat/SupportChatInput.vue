<template>
  <div class="sc-input">
    <InputWrapper class="sc-iwrapper">
      <TextInput
        v-model="message"
        placeholder="Опишите проблему или задайте вопрос"
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
  (e: 'send', message: string): void
}>()

const message = ref('')

function send() {
  emit('send', message.value)
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
</style>
