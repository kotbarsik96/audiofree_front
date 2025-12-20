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
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'
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

        updateLastMessageInChatList(message)

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

function updateLastMessageInChatList(message: ISupportChatMessage) {
  if ('chatsList' in store && props.chatId) {
    const chat = store.chatsList.find((item) => item.id === props.chatId)
    if (chat) {
      chat.latest_message = message.text

      store.chatsList = store.chatsList.sort((item1, item2) => {
        if (item1.id === chat.id) return -1
        return 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--gray-50);
  box-shadow: 0px -5px 30px rgba(0, 0, 0, 0.05);
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
      border: 1px solid var(--gray-200);
      background-color: var(--gray-50);
      padding: 0.25rem 0.75rem;
      font: var(--text-18);
      color: var(--gray-800);
      outline: none;
      transition: var(--general-transition);

      &::placeholder {
        color: var(--gray-300);
      }

      &:focus {
        border-color: var(--gray-400);
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
