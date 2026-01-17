<template>
  <div class="sc-dated-group">
    <SupportChatDate :date="group.date" />
    <SupportChatMessagesGroup
      v-for="messagesGroup in group.groups"
      :messages-group="messagesGroup"
      :current-sender-type="currentSenderType"
    />
  </div>
</template>

<script setup lang="ts">
import SupportChatDate from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatDate.vue'
import SupportChatMessagesGroup from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatMessagesGroup.vue'
import type { ISupportChatMessagesDateGroup } from '~/domain/support/chat/interfaces/ISupportChatMessagesDateGroup';
import { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'

const props = defineProps<{
  group: ISupportChatMessagesDateGroup
  currentSenderType: ESupportChatSenderType
}>()
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-dated-group {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sc-dated-group-gap);
}
</style>
