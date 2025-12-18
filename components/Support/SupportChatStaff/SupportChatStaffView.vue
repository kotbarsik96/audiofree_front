<template>
  <div class="sc-staff support-chat">
    <div class="chat-body" ref="chatBodyElement">
      <div class="inner">
        <div class="top-spy" ref="topSpyElement"></div>
        <SupportChatDatedGroup
          v-for="group in groupedByDateMessages"
          :group="group"
          :current-sender-type="ESupportChatSenderType.Staff"
        />
        <div class="bottom-spy" ref="bottomSpyElement"></div>
      </div>
    </div>
    <SupportChatInput />
  </div>
</template>

<script setup lang="ts">
import SupportChatInput from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatInput.vue'
import SupportChatDatedGroup from '~/components/Support/SupportChat/_Blocks/SupportChatDatedGroup.vue'
import { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'

const chatBodyElement = useTemplateRef<HTMLElement>('chatBodyElement')
const topSpyElement = useTemplateRef<HTMLElement>('topSpyElement')
const bottomSpyElement = useTemplateRef<HTMLElement>('bottomSpyElement')

const route = useRoute()

const chatId = computed(() => Number(route.params.id ?? 0))

const { groupedByDateMessages } = await useSupportChat(
  chatBodyElement,
  topSpyElement,
  bottomSpyElement,
  chatId
)
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
@use '/css/components/SupportChat.scss';
</style>
