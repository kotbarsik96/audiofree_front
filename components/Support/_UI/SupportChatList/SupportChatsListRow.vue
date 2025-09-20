<template>
  <tr class="sc-list-row">
    <td>
      <NuxtLink :to="link"> {{ chat.user_id }} | {{ chat.id }} </NuxtLink>
    </td>
    <td>
      <NuxtLink :to="link"> {{ chat.user_name }} </NuxtLink>
    </td>
    <td>
      <NuxtLink :to="link"> {{ chat.user_email ?? '—' }} </NuxtLink>
    </td>
    <td>
      <NuxtLink :to="link"> {{ chat.user_telegram ?? '—' }} </NuxtLink>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { ISupportChatsListItem } from '~/domain/chats/support-chat/interfaces/ISupportChatsListItem'

const props = defineProps<{
  chat: ISupportChatsListItem
}>()

const link = computed(() => ({
  name: 'SupportChatPage',
  params: { chat_id: props.chat.id },
}))
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-list-row {
  td {
    color: var(--gray-800);
    font: var(--text-16);
    text-align: center;
    border-right: 1px solid var(--gray-800);
    border-bottom: 1px solid var(--gray-800);
    padding: 0;

    a {
      display: block;
      width: 100%;
      height: 100%;
      padding: 0.25rem 1rem;
      transition: var(--general-transition);

      &:hover {
        background-color: var(--gray-200);
      }
    }

    &:last-child {
      border-right: 0;
    }
  }
}
</style>
