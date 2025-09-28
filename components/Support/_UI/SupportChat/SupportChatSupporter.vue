<template>
  <div
    class="schat --supporter"
    :class="{
      '--first-loading': !isMounted,
      '--scrolled-recently': wasScrolledRecently,
      '--input-disabled': inputDisabled,
    }"
  >
    <div class="chat-body" ref="chatBodyElement" @scroll="onChatBodyScroll">
      <div
        v-if="status === 'pending' || formattedMessages.length > 0"
        class="chat-groups"
      >
        <div v-show="isMounted" class="spy" ref="spyElementTop"></div>
        <SupportChatSkeleton v-if="isLoadingTop" />
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
            :class="{ '--right-sided': !group[0].by_user }"
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
                v-model:readMessages="readMessages"
              />
            </div>
          </div>
        </div>
        <SupportChatSkeleton v-if="isLoadingBottom" />
        <div
          v-show="isMounted"
          class="spy --bottom"
          ref="spyElementBottom"
        ></div>
      </div>
      <div v-else class="empty">
        <OperatorIcon class="e-svg" />
        <p class="e-text">Истории сообщений пока нет</p>
      </div>
    </div>
    <SupportChatInput
      class="chat-input"
      v-model="newMessage"
      @send="sendMessage"
    />
  </div>
</template>

<script setup lang="ts">
import SupportChatInput from '~/components/Support/_UI/SupportChat/SupportChatInput.vue'
import SupportChatMessage from '~/components/Support/_UI/SupportChat/SupportChatMessage.vue'
import OperatorIcon from '~/assets/images/icons/operator.svg'
import UserIcon from '~/assets/images/icons/user.svg'
import { useSupportChat } from '~/domain/chats/support-chat/useSupportChat'
import SupportChatSkeleton from '~/components/Support/_UI/SupportChat/SupportChatSkeleton.vue'
import type IPagination from '~/dataAccess/api/IPagination'
import type { ISupportChatMessage } from '~/domain/chats/support-chat/interfaces/ISupportChatMessage'
import { SupportChat } from '~/domain/chats/support-chat/SupportChat'
import type { IChatInfo } from '~/domain/chats/support-chat/interfaces/IChatInfo'

const echo = useEcho()
const { $afFetch } = useNuxtApp()

const route = useRoute()

const spyElementTop = useTemplateRef<HTMLElement>('spyElementTop')
const spyElementBottom = useTemplateRef<HTMLElement>('spyElementBottom')
const chatBodyElement = useTemplateRef<HTMLElement>('chatBodyElement')
const newMessage = ref('')

const inputDisabled = ref(false)

const page = ref(1)
const chatId = computed(() => route.params.chat_id as string)

const supportChat = new SupportChat()

const { formattedMessages } = supportChat

const loadHistoryUrl = 'support-chat/supporter/history'

const [
  { data: paginationData, error, execute: loadHistory, status },
  { data: chatInfoData },
] = await Promise.all([
  useAPI<IPagination<ISupportChatMessage>>(loadHistoryUrl, {
    credentials: 'include',
    query: {
      page,
      chat_id: toValue(chatId),
    },
    watch: false,
    onResponse: ({ response }) => {
      const messages = response._data?.data as ISupportChatMessage[]

      if (response.ok && messages) {
        messages.forEach((message) => supportChat.prependMessage(message))
      }
    },
  }),
  useAPI<{ data: IChatInfo }>('support-chat/chat-info', {
    credentials: 'include',
    query: {
      chat_id: chatId,
    },
  }),
])
const chatInfo = computed(() => chatInfoData.value?.data)

const {
  isMounted,
  onChatBodyScroll,
  wasScrolledRecently,
  isLoadingTop,
  isLoadingBottom,
  scrollChatBodyToBottom,
  readMessages
} = useSupportChat(
  spyElementTop,
  spyElementBottom,
  chatBodyElement,
  paginationData.value?.current_page ?? 0,
  paginationData.value?.last_page ?? 0,
  supportChat,
  chatInfo,
  loadHistoryUrl
)

if (error.value) {
  throw createError({
    status: error.value.statusCode,
    message: error.value.data?.message,
  })
}

async function sendMessage() {
  inputDisabled.value = true

  await $afFetch('support-chat/supporter/message', {
    method: 'POST',
    credentials: 'include',
    body: {
      message: newMessage.value,
      chat_id: chatId.value,
    },
    headers: {
      'X-Socket-ID': echo.socketId() as string,
    },
    onResponse: async ({ response }) => {
      const message = response._data.data.message as ISupportChatMessage
      if (response.ok && message) {
        supportChat.appendMessage(message)
        newMessage.value = ''
        await nextTick()
        scrollChatBodyToBottom()
      }
    },
    onResponseError() {},
  })

  inputDisabled.value = false
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
@use '/css/components/SupportChat.scss';
</style>
