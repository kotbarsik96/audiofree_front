<template>
  <div class="sc-messages-group">
    <SupportChatMessage
      v-for="message in group"
      :message="message"
      :current-sender-type="currentSenderType"
    />
  </div>
</template>

<script setup lang="ts">
import SupportChatMessage from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatMessage.vue'
import type { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'

const props = defineProps<{
  group: ISupportChatMessage[]
  currentSenderType: ESupportChatSenderType
}>()
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
</style>
