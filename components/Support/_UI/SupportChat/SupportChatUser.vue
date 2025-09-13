<template>
  <div
    class="schat-user"
    :class="{
      '--first-loading': !isMounted,
      '--scrolled-recently': wasScrolledRecently,
      '--sending': sending,
    }"
  >
    <div v-if="!!user" class="chat">
      <div class="chat-body" ref="chatBodyElement" @scroll="onChatBodyScroll">
        <div class="chat-groups">
          <div v-show="isMounted" class="spy" ref="spyElement"></div>
          <div v-for="(item, i) in formattedList" :key="i" class="dated-group">
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
import { useSupportChat } from '~/domain/chats/support-chat/useSupportChat'
import SupportChatSkeleton from '~/components/Support/_UI/SupportChat/SupportChatSkeleton.vue'

const { $echo } = useNuxtApp()

const { user } = useSanctumAuth()

const spyElement = useTemplateRef<HTMLElement>('spyElement')
const chatBodyElement = useTemplateRef<HTMLElement>('chatBodyElement')

const {
  formattedList,
  isMounted,
  send,
  sending,
  onChatBodyScroll,
  wasScrolledRecently,
  newMessage,
} = useSupportChat(spyElement, chatBodyElement)
</script>

<style lang="scss" scoped>
.schat-user {
  --chat-padding-block: 1rem;
  --chat-padding-inline: 1rem;

  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .in-development {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    text-align: center;
    font: var(--text-18);
    font-weight: 500;

    .icon {
      width: 5rem;
      height: 5rem;
    }
  }

  .chat {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    position: relative;
  }

  .chat-body {
    overflow: auto;
    max-height: 400px;
    padding: var(--chat-padding-block) var(--chat-padding-inline);
  }

  .chat-groups {
    position: relative;
  }

  .dated-group {
    padding-block-start: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    position: relative;
  }

  .group-date {
    position: sticky;
    top: 0;
    border-radius: 8px;
    align-self: center;
    background-color: var(--gray-200);
    padding: 0.15rem 0.5rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    transition: var(--general-transition);

    &:not(.--intersected) {
      opacity: 0;
      pointer-events: none;
    }
  }

  .messages-group {
    display: flex;
    gap: 0.625rem;

    .mg-avatar {
      position: relative;
      flex-shrink: 0;

      svg {
        position: sticky;
        top: 0;
        width: 1.5rem;
        height: auto;
        aspect-ratio: 1;
      }
    }

    .mg-messages {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }

    &.--right-sided {
      flex-direction: row-reverse;
    }
  }

  .spy {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    opacity: 0;
    width: 100%;
    height: 1px;
    z-index: -999;
    pointer-events: none;
  }

  &.--first-loading {
    .chat {
      pointer-events: none;
      opacity: 0.25;
    }
  }

  &.--first-loading,
  &.--sending {
    .chat-input {
      pointer-events: none;
      opacity: 0.5;
    }
  }

  &.--scrolled-recently {
    .group-date,
    .group-date:not(.--intersected) {
      opacity: 1;
      pointer-events: auto;
    }
  }
}
</style>
