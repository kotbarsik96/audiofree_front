<template>
  <tr>
    <td>
      <NuxtLink :to="link">
        {{ chat.id }}
        <br />
        {{ formatMonthAndYear(chat.created_at) }}
      </NuxtLink>
    </td>
    <td>
      <NuxtLink :to="link">
        {{ chat.user_name }}
      </NuxtLink>
    </td>
    <td>
      <NuxtLink :to="link">
        {{ chat.user_email ?? '–' }}
      </NuxtLink>
    </td>
    <td>
      <NuxtLink :to="link">
        {{ chat.user_phone ?? '–' }}
      </NuxtLink>
    </td>
    <td>
      <NuxtLink :to="link">
        {{ supportChatSenderTypeMap[chat.lateset_message.sender_type] }}: "{{
          chat.lateset_message.text
        }}"
      </NuxtLink>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { supportChatSenderTypeMap } from '~/domain/support/chat/interfaces/ESupportChatSenderType'
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
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

tr {
  td {
    &:last-child {
      max-width: 300px;
    }
  }
}
</style>
