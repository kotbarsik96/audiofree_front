<template>
  <div
    class="schat"
    :class="{
      '--first-loading': !isMounted,
      '--scrolled-recently': wasScrolledRecently,
      '--input-disabled': inputDisabled,
    }"
  >
    <div v-if="!!user" class="chat">
      <div class="chat-body" ref="chatBodyElement" @scroll="onChatBodyScroll">
        <div
          v-if="loadHistoryStatus === 'pending' || formattedMessages.length > 0"
          class="chat-groups"
        >
          <SupportChatSkeleton v-if="loadHistoryStatus === 'pending'" />
          <div v-show="isMounted" class="spy" ref="spyElement"></div>
          <div
            v-for="(item, i) in formattedMessages"
            :key="i"
            class="dated-group"
          >
            <div class="group-date">
              {{ formatMonthAndYear(item.date) }}
            </div>
            <div
              v-for="group in item.groups"
              class="messages-group"
              :class="{ '--right-sided': group[0].by_user }"
            >
              <div class="mg-avatar">
                <UserIcon v-if="group[0].by_user" />
                <OperatorIcon v-else />
              </div>
              <div class="mg-messages">
                <SupportChatMessage
                  v-for="(message, mIndex) in group"
                  :key="message.id"
                  :message="message"
                  :is-first="mIndex === 0"
                  user-pov
                />
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty">
          <SupportIcon class="e-svg" />
          <p class="e-text">
            Здесь будет история сообщений с технической поддержкой
          </p>
        </div>
      </div>
      <SupportChatInput class="chat-input" v-model="newMessage" @send="send" />
    </div>
    <LoginToUseSupport v-else />
  </div>
</template>

<script setup lang="ts">
import LoginToUseSupport from '~/components/Support/_UI/SupportChat/LoginToUseSupport.vue'
import SupportChatInput from '~/components/Support/_UI/SupportChat/SupportChatInput.vue'
import SupportChatMessage from '~/components/Support/_UI/SupportChat/SupportChatMessage.vue'
import OperatorIcon from '~/assets/images/icons/operator.svg'
import UserIcon from '~/assets/images/icons/user.svg'
import SupportIcon from '~/assets/images/icons/operator.svg'
import { useSupportChat } from '~/domain/chats/support-chat/useSupportChat'
import SupportChatSkeleton from '~/components/Support/_UI/SupportChat/SupportChatSkeleton.vue'
import { SupportChatUser } from '~/domain/chats/support-chat/SupportChatUser'

const { $echo, $afFetch } = useNuxtApp()

const { user } = useSanctumAuth()

const spyElement = useTemplateRef<HTMLElement>('spyElement')
const chatBodyElement = useTemplateRef<HTMLElement>('chatBodyElement')

const supportChat = new SupportChatUser($afFetch)
const { formattedMessages, loadHistoryStatus, newMessage, loadHistory } =
  supportChat

await loadHistory()

console.log(supportChat);

const {
  isMounted,
  send,
  inputDisabled,
  onChatBodyScroll,
  wasScrolledRecently,
} = useSupportChat(spyElement, chatBodyElement, supportChat)
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
@use '/css/components/SupportChat.scss';
</style>
