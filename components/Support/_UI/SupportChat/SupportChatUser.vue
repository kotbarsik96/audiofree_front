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
        <div v-if="formattedMessages.length > 0" class="chat-groups">
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
      <SupportChatInput
        class="chat-input"
        v-model="newMessage"
        @send="sendMessage"
      />
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
import { SupportChat } from '~/domain/chats/support-chat/SupportChat'
import type { ISupportChatMessage } from '~/domain/chats/support-chat/interfaces/ISupportChatMessage'
import type IPagination from '~/dataAccess/api/IPagination'
import type { ICurrentUserSupportChatInfo } from '~/domain/chats/support-chat/interfaces/ICurrentUserSupportChatInfo'

const { $echo, $afFetch } = useNuxtApp()

const { user } = useSanctumAuth()
const { addNotification } = useNotifications()

const newMessage = ref('')
const page = useState('support_chat_user_page', () => 1)
const inputDisabled = ref(false)

const spyElement = useTemplateRef<HTMLElement>('spyElement')
const chatBodyElement = useTemplateRef<HTMLElement>('chatBodyElement')

const supportChat = new SupportChat()
const { formattedMessages } = supportChat

const [
  { data: paginationData, execute: loadHistory, status: loadHistoryStatus },
  { data: chatData },
] = await Promise.all([
  useAPI<IPagination<ISupportChatMessage>>('support-chat/user/history', {
    credentials: 'include',
    query: {
      page,
    },
    watch: false,
    onResponse: ({ response }) => {
      const messages = response._data?.data as ISupportChatMessage[]

      if (response.ok && messages) {
        messages.forEach((message) => supportChat.prependMessage(message))
      }
    },
  }),
  useAPI<{ data: ICurrentUserSupportChatInfo }>(
    'support-chat/current-user-chat',
    {
      credentials: 'include',
      watch: false,
    }
  ),
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
  loadHistoryStatus,
  loadHistory
)

async function sendMessage() {
  inputDisabled.value = true

  await $afFetch('support-chat/user/message', {
    method: 'POST',
    credentials: 'include',
    body: {
      message: newMessage.value,
    },
    onResponse: async ({ response }) => {
      const message = response._data.data?.message as
        | ISupportChatMessage
        | undefined
      if (response.ok && message) {
        supportChat.appendMessage(message)
        newMessage.value = ''
        await nextTick()
        scrollChatBodyToBottom()
      }
    },
    onResponseError: () => {
      addNotification('error', 'Не удалось отправить сообщение')
    },
  })

  inputDisabled.value = false
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
@use '/css/components/SupportChat.scss';
</style>
