<template>
  <NuxtLink class="scs-link" :to="link">
    <div class="credentials">
      <div class="name">
        {{ chat.user_name }}
      </div>
      <div class="contacts">({{ contactsString }})</div>
    </div>
    <div class="latest-message">
      {{ chat.lateset_message.text.slice(0, 250) }}
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { ISupportChatListItem } from '~/domain/support/chat/interfaces/ISupportChatListItem'

const props = defineProps<{
  chat: ISupportChatListItem
}>()

const link = computed(() => ({
  name: 'SupportChatStaffPage',
  params: {
    id: props.chat.id,
  },
}))

const contactsString = computed(() =>
  [props.chat.user_email, props.chat.user_phone]
    .filter((str) => !!str)
    .join(' / ')
)
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.scs-link {
  padding: 0.625rem 1rem;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  transition: var(--general-transition);

  .credentials {
    .name {
      font: var(--text-18);
      color: var(--gray-900);
    }

    .contats {
      font: var(--text-16);
      color: var(--gray-700);
    }
  }

  .latest-message {
    color: var(--gray-800);
    font: var(--text-16);
    min-width: 0;
    overflow-wrap: break-word;
    @include mixins.lines(3);
  }

  &:not(:first-child) {
    border-top: 1px solid var(--gray-800);
  }
  
  &:hover {
    background-color: var(--gray-200);
  }
}
</style>
