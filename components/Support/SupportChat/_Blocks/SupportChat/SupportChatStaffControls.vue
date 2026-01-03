<template>
  <div class="sc-s-controls" :class="classes">
    <AFButton
      class="toggle-btn"
      :label="toggleText"
      :disabled="isStatusChanging"
      @click="changeStatus"
    />
  </div>
</template>

<script setup lang="ts">
import AFButton from '~/components/_UI/AFButton.vue'
import { ESupportChatStatus } from '~/domain/support/chat/interfaces/ESupportChatStatus'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'

const props = defineProps<{
  chatInfo: ISupportChatInfo
}>()

const { $afFetch } = useNuxtApp()
const { addNotification } = useNotifications()

const reverseStatus = computed(() => {
  const map: Record<ESupportChatStatus, ESupportChatStatus> = {
    [ESupportChatStatus.Closed]: ESupportChatStatus.Open,
    [ESupportChatStatus.Open]: ESupportChatStatus.Closed,
  }
  return map[props.chatInfo.status]
})

const isStatusChanging = ref(false)
const changeStatus = async () => {
  if (isStatusChanging.value) return

  isStatusChanging.value = true

  try {
    // статус обновится через событие .support-chat-changed-info
    await $afFetch('/support-chat/change-status', {
      method: "POST",
      credentials: 'include',
      body: {
        chat_id: props.chatInfo.chat_id,
        status: reverseStatus.value,
      },
    })
  } catch (err) {
    addNotification('error', 'Не удалось обновить статус чата')
  }

  isStatusChanging.value = false
}

const toggleText = computed(() => {
  let text = ''

  switch (props.chatInfo.status) {
    case ESupportChatStatus.Closed:
      text = 'Открыть чат'
      break
    case ESupportChatStatus.Open:
      text = 'Закрыть чат'
      break
  }

  return text
})

const classes = computed(() => ({
  '--closed': props.chatInfo.status === ESupportChatStatus.Closed,
  '--open': props.chatInfo.status === ESupportChatStatus.Open,
}))
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-s-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.25rem 1rem 0.5rem 1rem;

  &.--closed {
    .toggle-btn {
      background-color: var(--secondary-2);

      &:hover:not(:disabled) {
        box-shadow: 0px 8px 5px rgba(13, 177, 10, 0.25);
      }
    }
  }

  &.--open {
    .toggle-btn {
      background-color: var(--red);

      &:hover:not(:disabled) {
        box-shadow: 0px 8px 5px rgba(218, 1, 1, 0.25);
      }
    }
  }
}
</style>
