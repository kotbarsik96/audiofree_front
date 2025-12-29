<template>
  <div class="sc-user support-chat" :class="classes">
    <SupportChatHeader
      :chat-info="chatInfo"
      :current-sender-type="ESupportChatSenderType.User"
    />
    <div
      v-if="hasChat"
      class="chat-body"
      ref="chatBodyElement"
      @scroll="onChatBodyScroll"
    >
      <div class="inner">
        <div v-if="!allEarlierMessagesLoaded" class="chat-loader">
          <SpinnerLoader />
        </div>
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
    <Transition name="fade-in">
      <SupportChatBottomButton
        v-if="chatInfo && (isBtnVisible || chatInfo.unread_messages > 0)"
        :chat-info="chatInfo"
        :chat-body-element="chatBodyElement"
        @click="onChatBottomBtnClick"
      />
    </Transition>
    <SupportChatInput @message-written="onMessageWritten" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import SpinnerLoader from '~/components/_UI/Loaders/SpinnerLoader.vue'
import SupportChatInput from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatInput.vue'
import SupportChatDatedGroup from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatDatedGroup.vue'
import SupportChatHeader from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatHeader.vue'
import SupportIcon from '~/assets/images/icons/support.svg?component'
import { useSupportChat } from '~/composables/useSupportChat'
import { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import { useSupportChatUserStore } from '~/stores/supportChat/supportChatUserStore'
import SupportChatBottomButton from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatBottomButton.vue'

const chatBodyElement = useTemplateRef<HTMLElement>('chatBodyElement')
const topSpyElement = useTemplateRef<HTMLElement>('topSpyElement')
const bottomSpyElement = useTemplateRef<HTMLElement>('bottomSpyElement')

const [{ data: pageData }, { onMessageWritten, allEarlierMessagesLoaded }] =
  await Promise.all([
    useAPI<{ data: IPageSeo }>('page/contacts'),
    useSupportChat(chatBodyElement, topSpyElement, bottomSpyElement),
  ])
usePageMeta(pageData)

const store = useSupportChatUserStore()
const { messagesGroupedByDate, chatInfo } = storeToRefs(store)

const hasChat = computed(() => !!chatInfo.value)

const { isBtnVisible, onChatBodyScroll, onChatBottomBtnClick } =
  useSupportChatBottomButton(chatBodyElement)

const classes = computed(() => ({
  '--all-earlier-loaded': allEarlierMessagesLoaded.value,
}))
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
@use '/css/components/SupportChat.scss';
</style>
