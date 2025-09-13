<template>
  <div class="sc-message" :class="classes">
    <div v-if="isFirst" class="author-name">
      <template v-if="userPov">
        {{ message.by_user ? user?.name || 'Вы' : 'Сотрудник тех.поддержки' }}
      </template>
      <template v-else>
        {{ message.by_user ? 'Пользователь' : 'Сотрудник тех.поддержки' }}
      </template>
    </div>
    <div class="message">{{ message.message_text }}</div>
    <time class="time" :datetime="message.created_at">
      {{ formatTime(message.created_at) }}
    </time>
  </div>
</template>

<script setup lang="ts">
import type { ISupportChatMessage } from '~/domain/chats/support-chat/interfaces/ISupportChatMessage'
import type IUser from '~/domain/user/types/IUser'
import { formatTime } from '~/utils/date'

const props = defineProps<{
  message: ISupportChatMessage
  isFirst: boolean
  userPov?: boolean
}>()

const { user } = useSanctumAuth<IUser>()

const classes = computed(() => ({
  '--right-sided':
    (props.userPov && props.message.by_user) ||
    (!props.userPov && !props.message.by_user),
}))
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-message {
  background-color: var(--white);
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.07);
  max-width: 400px;

  .author-name {
    font: var(--text-16);
    font-weight: 600;
    color: var(--gray-800);
    margin-block-end: 0.5rem;
  }

  .message {
    font: var(--text-14);
    color: var(--gray-700);
  }

  .time {
    display: block;
    width: 100%;
    text-align: right;
    color: var(--gray-600);
    font: var(--text-14);
  }
}
</style>
