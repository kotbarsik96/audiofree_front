<template>
  <div class="sc-user support-chat">
    <div v-if="hasChat" class="chat-body" ref="chatBodyElement">
      <div class="inner">
        <div class="top-spy" ref="topSpyElement"></div>
        <SupportChatDatedGroup
          v-for="group in messagesGroupedByDate"
          :group="group"
          :current-sender-type="ESupportChatSenderType.User"
        />
        <div class="bottom-spy" ref="bottomSpyElement"></div>
      </div>
    </div>
    <div v-else class="chat-empty">
      <SupportIcon class="ce-icon" />
      <div class="ce-title">
        Здесь будет ваша история сообщений с чатом технической поддержки
      </div>
      <div class="ce-subtitle">
        Если у вас есть вопрос – напишите его в чат, вам ответит первый
        свободный сотрудник
      </div>
    </div>
    <SupportChatInput @message-written="onMessageWritten" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import SupportChatInput from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatInput.vue'
import SupportChatDatedGroup from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatDatedGroup.vue'
import SupportIcon from '~/assets/images/icons/support.svg?component'
import { useSupportChat } from '~/composables/useSupportChat'
import { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import { useSupportChatUserStore } from '~/stores/supportChat/supportChatUserStore'

const chatBodyElement = useTemplateRef<HTMLElement>('chatBodyElement')
const topSpyElement = useTemplateRef<HTMLElement>('topSpyElement')
const bottomSpyElement = useTemplateRef<HTMLElement>('bottomSpyElement')

const [{ data: pageData }, { onMessageWritten }] = await Promise.all([
  useAPI<{ data: IPageSeo }>('page/contacts'),
  useSupportChat(chatBodyElement, topSpyElement, bottomSpyElement),
])
usePageMeta(pageData)

const store = useSupportChatUserStore()
const { messagesGroupedByDate, chatInfo } = storeToRefs(store)

const hasChat = computed(() => !!chatInfo.value)
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
@use '/css/components/SupportChat.scss';
</style>
