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
        <SupportChatSkeleton v-if="status === 'pending'" />
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
import type { ICurrentUserSupportChatInfo } from '~/domain/chats/support-chat/interfaces/ICurrentUserSupportChatInfo'

const echo = useEcho()
const { $afFetch } = useNuxtApp()

const route = useRoute()

const spyElement = useTemplateRef<HTMLElement>('spyElement')
const chatBodyElement = useTemplateRef<HTMLElement>('chatBodyElement')
const newMessage = ref('')

const inputDisabled = ref(false)

const page = ref(1)
const chatId = computed(() => route.params.chat_id as string)

const supportChat = new SupportChat()

const { formattedMessages } = supportChat

const [
  { data: paginationData, error, execute: loadHistory, status },
  { data: chatData },
] = await Promise.all([
  useAPI<IPagination<ISupportChatMessage>>('support-chat/supporter/history', {
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
  useAPI<{ data: ICurrentUserSupportChatInfo }>('support-chat/chat-info', {
    credentials: 'include',
    query: {
      chat_id: chatId,
    },
  }),
])

const {
  isMounted,
  onChatBodyScroll,
  wasScrolledRecently,
  scrollChatBodyToBottom,
} = useSupportChat(
  spyElement,
  chatBodyElement,
  page,
  paginationData,
  status,
  loadHistory
)

if (error.value) {
  throw createError({
    status: error.value.statusCode,
    message: error.value.data?.message,
  })
}

onMounted(() => {
  echo
    .private(`support.message.${chatId.value}`)
    .listen('.support-message', (message: ISupportChatMessage) => {
      supportChat.appendMessage(message)
    })
    .listen('.support-read-message', (messagesIds: number[]) => {
      supportChat.readMessages(messagesIds)
    })
})

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
