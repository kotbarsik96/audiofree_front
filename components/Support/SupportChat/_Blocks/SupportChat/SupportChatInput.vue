<template>
  <form class="sc-input" @submit.prevent="onSubmit">
    <div class="input-wrap">
      <input
        class="input"
        type="text"
        maxlength="3000"
        placeholder="Сообщение"
        v-model="text"
      />
    </div>
    <button class="send-btn" type="submit">
      <IconSend />
    </button>
  </form>
</template>

<script setup lang="ts">
import IconSend from '~/assets/images/icons/send.svg?component'
import { useSupportChatStaffStore } from '~/stores/supportChat/supportChatStaffStore'
import { useSupportChatUserStore } from '~/stores/supportChat/supportChatUserStore'

const props = defineProps<{
  chatId?: number
}>()

const emit = defineEmits<{
  (e: 'message-written'): void
}>()

const { addNotification } = useNotifications()

const { $afFetch } = useNuxtApp()

const text = ref('')

const store = props.chatId
  ? useSupportChatStaffStore()
  : useSupportChatUserStore()

const { messagesGroupedByDate, latestMessageId } = storeToRefs(store)

async function onSubmit() {
  await send()
}

async function send() {
  console.log('sending')
  try {
    await $afFetch('/support-chat/message', {
      method: 'POST',
      credentials: 'include',
      body: {
        chat_id: props.chatId,
        text: text.value,
      },
      onResponse({ response }) {
        const { message, latest_loaded_id } = response._data.data
        messagesGroupedByDate.value = formatAndAppendMessages(
          messagesGroupedByDate.value,
          [message]
        )
        latestMessageId.value = latest_loaded_id
        text.value = ''

        emit('message-written')
      },
      onResponseError({ response }) {
        addNotification('error', 'Не удалось отправить сообщение')
      },
    })
  } catch (err) {
    addNotification('error', 'Не удалось отправить сообщение')
  }
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--white);
  box-shadow: 1px 1px 1px #000;
  padding: 0.5rem 1rem;

  .input-wrap {
    flex: 1 1 auto;
    display: flex;
    align-items: center;

    .input {
      width: 100%;
      height: 2.15rem;
      border-radius: 8px;
      resize: none;
      border: 1px solid var(--gray-300);
      padding: 0.25rem 0.75rem;
      font: var(--text-18);
      color: var(--gray-800);
      outline: none;

      &::placeholder {
        color: var(--gray-200);
      }
    }
  }

  .send-btn {
    width: 2.15rem;
    height: auto;
    aspect-ratio: 1;
    border-radius: 8px;
    background-color: var(--gray-200);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--general-transition);

    svg {
      width: 1.5rem;
      height: auto;
      aspect-ratio: 1;
      color: var(--gray-900);
      transition: var(--general-transition);
    }

    &:hover {
      background-color: var(--primary);

      svg {
        color: var(--gray-50);
      }
    }
  }
}
</style>
