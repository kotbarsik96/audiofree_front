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
import type { IChatInfo } from '~/domain/chats/support-chat/interfaces/IChatInfo'

const { $afFetch } = useNuxtApp()

const { addNotification } = useNotifications()

const echo = useEcho()

const newMessage = ref('')
const inputDisabled = ref(false)

const spyElementTop = useTemplateRef<HTMLElement>('spyElementTop')
const spyElementBottom = useTemplateRef<HTMLElement>('spyElementBottom')
const chatBodyElement = useTemplateRef<HTMLElement>('chatBodyElement')

const supportChat = new SupportChat()
const { formattedMessages } = supportChat

const loadHistoryUrl = 'support-chat/user/history'

const [{ data: paginationData }, { data: chatInfoData }] = await Promise.all([
  useAPI<IPagination<ISupportChatMessage>>(loadHistoryUrl, {
    credentials: 'include',
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
    watch: false,
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
