<template>
  <div
    class="schat"
    :class="{
      '--first-loading': !isMounted,
      '--scrolled-recently': wasScrolledRecently,
      '--input-disabled': inputDisabled,
    }"
  >
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
</template>

<script setup lang="ts">
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

const { $afFetch } = useNuxtApp()

const echo = useEcho()

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
  useAPI<{ data: ICurrentUserSupportChatInfo }>('support-chat/chat-info', {
    credentials: 'include',
    watch: false,
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
  loadHistoryStatus,
  loadHistory
)

onMounted(() => {
  echo
    .private(`support.message.${chatData.value?.data.chat_id}`)
    .listen('.support-message', (message: ISupportChatMessage) => {
      supportChat.appendMessage(message)
    })
    .listen('.support-read-message', (messagesIds: number[]) => {
      supportChat.readMessages(messagesIds)
    })
})

async function sendMessage() {
  inputDisabled.value = true

  try {
    await $afFetch('support-chat/user/message', {
      method: 'POST',
      credentials: 'include',
      body: {
        message: newMessage.value,
      },
      headers: {
        'X-Socket-ID': echo.socketId() as string,
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
  } catch (er) {
    console.error(er)
  }

  inputDisabled.value = false
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
@use '/css/components/SupportChat.scss';
</style>
