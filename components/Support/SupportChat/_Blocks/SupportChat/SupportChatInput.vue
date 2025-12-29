<template>
  <form class="sc-input" @submit.prevent="onSubmit">
    <div class="input-wrap">
      <input
        class="input"
        type="text"
        maxlength="3000"
        placeholder="Сообщение"
        v-model="text"
        :disabled="sending"
        @input="onInput"
      />
    </div>
    <button class="send-btn" :disabled="sending" type="submit">
      <IconSend />
    </button>
  </form>
</template>

<script setup lang="ts">
import IconSend from '~/assets/images/icons/send.svg?component'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'
import { useSupportChatStaffStore } from '~/stores/supportChat/supportChatStaffStore'
import { useSupportChatUserStore } from '~/stores/supportChat/supportChatUserStore'
import { formatAndAppendMessages } from '~/domain/support/chat/utils'

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

const sending = ref(false)

let isWritingTimeout: ReturnType<typeof setTimeout> | undefined
const didntWriteFor = 3000
async function onInput() {
  // запустить таймаут на сброс: отработает, когда пользователь не печатал уже didntWriteFor милисекунд
  const launch = () =>
    setTimeout(async () => {
      await updateIsWritingStatus(false)
      clearTimeout(isWritingTimeout)
      isWritingTimeout = undefined
    }, didntWriteFor)

  // пользователь печатает - перезапустить таймаут
  if (isWritingTimeout) {
    clearTimeout(isWritingTimeout)
    isWritingTimeout = launch()
  }
  // пользователь ещё не печатал - обновить состояние в true и запустить таймаут
  else if (text.value.trim()) {
    isWritingTimeout = launch()
    await updateIsWritingStatus(true)
  }
}

onMounted(() => {
  window.addEventListener('unload', onWindowUnload)
})

onUnmounted(() => {
  window.removeEventListener('unload', onWindowUnload)
  onWindowUnload()
})

function onWindowUnload() {
  if (isWritingTimeout) clearTimeout(isWritingTimeout)
  updateIsWritingStatus(false, true)
}

async function updateIsWritingStatus(is_writing: boolean, keepalive = false) {
  await $afFetch('/support-chat/update-writing-status', {
    method: 'POST',
    body: {
      chat_id: props.chatId,
      is_writing,
    },
    credentials: 'include',
    keepalive,
  })
}

async function onSubmit() {
  await send()
}

async function send() {
  if (sending.value) return

  sending.value = true

  try {
    await $afFetch('/support-chat/message', {
      method: 'POST',
      credentials: 'include',
      body: {
        chat_id: props.chatId,
        text: text.value,
      },
      onResponse({ response }) {
        const message = response._data.data.message as ISupportChatMessage

        if (isWritingTimeout) clearTimeout(isWritingTimeout)
        updateIsWritingStatus(false)
        text.value = ''
        formatAndAppendMessages(
          messagesGroupedByDate.value,
          [message],
          latestMessageId
        )
        latestMessageId.value = message.id
        emit('message-written')
      },
      onResponseError({ response }) {
        addNotification('error', 'Не удалось отправить сообщение')
      },
    })
  } catch (err) {
    addNotification('error', 'Не удалось отправить сообщение')
  }

  sending.value = false
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
