<template>
  <div class="schat-user" :class="{ '--first-loading': !isMounted }">
    <div v-if="!!user" class="chat">
      <div class="chat-groups" ref="chatGroupsElement">
        <div v-show="isMounted" class="spy" ref="spyElement"></div>
        <div v-for="(item, i) in formattedList" :key="i" class="dated-group">
          <div class="group-date">{{ formatMonthAndYear(item.date) }}</div>
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
      <SupportChatInput class="chat-input" @send="send" />
    </div>
    <LoginToUseSupport v-else />
  </div>
</template>

<script setup lang="ts">
import LoginToUseSupport from '~/components/Support/_UI/SupportChat/LoginToUseSupport.vue'
import SupportChatInput from '~/components/Support/_UI/SupportChat/SupportChatInput.vue'
import SupportChatMessage from '~/components/Support/_UI/SupportChat/SupportChatMessage.vue'
import type { ISupportChatMessage } from '~/domain/chats/support-chat/interfaces/ISupportChatMessage'
import OperatorIcon from '~/assets/images/icons/operator.svg'
import UserIcon from '~/assets/images/icons/user.svg'
import type IPagination from '~/dataAccess/api/IPagination'
import { useSupportChat } from '~/domain/chats/support-chat/useSupportChat'

const { $echo } = useNuxtApp()

const { user } = useSanctumAuth()

const spyElement = useTemplateRef<HTMLElement>('spyElement')
const chatGroupsElement = useTemplateRef<HTMLElement>('chatGroupsElement')

const { formattedList, isMounted, send, sending } = useSupportChat(
  spyElement,
  chatGroupsElement
)
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

  .chat-groups {
    padding: var(--chat-padding-block) var(--chat-padding-inline);
    overflow: auto;
    max-height: 400px;
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

  .chat-input {
  }

  &.--first-loading {
    .chat {
      pointer-events: none;
      opacity: 0.25;
    }

    .chat-input {
      pointer-events: none;
      opacity: 0.5;
    }
  }
}
</style>
