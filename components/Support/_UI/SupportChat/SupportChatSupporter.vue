<template>
  <div
    class="schat --supporter"
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
          <OperatorIcon class="e-svg" />
          <p class="e-text">Истории сообщений пока нет</p>
        </div>
      </div>
      <SupportChatInput class="chat-input" v-model="newMessage" @send="send" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SupportChatInput from '~/components/Support/_UI/SupportChat/SupportChatInput.vue'
import SupportChatMessage from '~/components/Support/_UI/SupportChat/SupportChatMessage.vue'
import OperatorIcon from '~/assets/images/icons/operator.svg'
import UserIcon from '~/assets/images/icons/user.svg'
import { useSupportChat } from '~/domain/chats/support-chat/useSupportChat'
import SupportChatSkeleton from '~/components/Support/_UI/SupportChat/SupportChatSkeleton.vue'
import { SupportChatSupporter } from '~/domain/chats/support-chat/SupportChatSupporter'

const { $echo, $afFetch } = useNuxtApp()

const route = useRoute()

const { user } = useSanctumAuth()

const spyElement = useTemplateRef<HTMLElement>('spyElement')
const chatBodyElement = useTemplateRef<HTMLElement>('chatBodyElement')

const supportChat = new SupportChatSupporter(
  $afFetch,
  () => route.params.chat_id as string
)

const { newMessage, formattedMessages, loadHistoryStatus, error, loadHistory } =
  supportChat

await loadHistory()

const {
  isMounted,
  send,
  inputDisabled,
  onChatBodyScroll,
  wasScrolledRecently,
} = useSupportChat(spyElement, chatBodyElement, supportChat)

if (error.value) {
  throw createError({
    status: error.value.statusCode,
    message: error.value.data?.message,
  })
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
@use '/css/components/SupportChat.scss';
</style>
