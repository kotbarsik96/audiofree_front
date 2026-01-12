<template>
  <div class="sc-staff support-chat">
    <SupportChatHeader
      :chat-info="chatInfo"
      :current-sender-type="ESupportChatSenderType.Staff"
    />
    <div class="chat-body" ref="chatBodyElement" @scroll="onChatBodyScroll">
      <SupportChatSkeleton v-if="isFirstLoading" />
      <div v-else class="inner">
        <div v-if="!allEarlierMessagesLoaded" class="chat-loader">
          <SpinnerLoader />
        </div>
        <div class="top-spy" ref="topSpyElement"></div>
        <SupportChatDatedGroup
          v-for="group in messagesGroupedByDate"
          :key="group.date"
          :group="group"
          :current-sender-type="ESupportChatSenderType.Staff"
        />
        <div class="bottom-spy" ref="bottomSpyElement"></div>
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
    <SupportChatInput :chat-id="chatId" @message-written="onMessageWritten" />
    <SupportChatStaffControls v-if="chatInfo" :chat-info="chatInfo" />
  </div>
</template>

<script setup lang="ts">
import SpinnerLoader from '~/components/_UI/Loaders/SpinnerLoader.vue'
import SupportChatSkeleton from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatSkeleton.vue'
import SupportChatHeader from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatHeader.vue'
import SupportChatBottomButton from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatBottomButton.vue'
import { storeToRefs } from 'pinia'
import SupportChatInput from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatInput.vue'
import SupportChatDatedGroup from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatDatedGroup.vue'
import { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import { useSupportChatStaffStore } from '~/stores/supportChat/supportChatStaffStore'
import SupportChatStaffControls from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatStaffControls.vue'
import { useSupportChatBottomButton } from '~/domain/support/chat/composeables/useSupportChatBottomButton'
import { useSupportChatGeneral } from '~/domain/support/chat/composeables/useSupportChatGeneral'

const chatBodyElement = useTemplateRef<HTMLElement>('chatBodyElement')
const topSpyElement = useTemplateRef<HTMLElement>('topSpyElement')
const bottomSpyElement = useTemplateRef<HTMLElement>('bottomSpyElement')

const route = useRoute()

const chatId = computed(() => Number(route.params.id ?? 0))

const { onMessageWritten } = await useSupportChatGeneral(
  chatBodyElement,
  topSpyElement,
  bottomSpyElement,
  chatId
)

const store = useSupportChatStaffStore()
const {
  messagesGroupedByDate,
  chatInfo,
  isFirstLoading,
  allEarlierMessagesLoaded,
} = storeToRefs(store)

const { isBtnVisible, onChatBodyScroll, onChatBottomBtnClick } =
  useSupportChatBottomButton(chatBodyElement)
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
@use '/css/components/SupportChat.scss';

.sc-staff {
  .sc-bottom-btn {
    bottom: 7.5rem;
  }
}
</style>
