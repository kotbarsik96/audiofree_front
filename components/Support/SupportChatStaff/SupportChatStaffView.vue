<template>
  <div class="sc-staff support-chat">
    <div class="top-spy" ref="topSpyElement"></div>
    <div class="chat-body">
      <div class="dated-group">
        <template v-for="groupOrDate in messages">
          <SupportChatDate
            v-if="'date' in groupOrDate"
            :date-data="groupOrDate"
          />
          <SupportChatMessagesGroup
            v-else-if="'group' in groupOrDate"
            :current-sender-type="ESupportChatSenderType.Staff"
            :group-data="groupOrDate"
          />
        </template>
      </div>
    </div>
    <SupportChatInput />
    <div class="bottom-spy" ref="bottomSpyElement"></div>
  </div>
</template>

<script setup lang="ts">
import SupportChatDate from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatDate.vue'
import SupportChatMessagesGroup from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatMessagesGroup.vue'
import SupportChatInput from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatInput.vue'
import { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'

const topSpyElement = useTemplateRef<HTMLElement>('topSpyElement')
const bottomSpyElement = useTemplateRef<HTMLElement>('bottomSpyElement')

const route = useRoute()

const chatId = computed(() => Number(route.params.id ?? 0))

const { messages } = await useSupportChat(
  topSpyElement,
  bottomSpyElement,
  chatId
)
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
@use '/css/components/SupportChat.scss';
</style>
