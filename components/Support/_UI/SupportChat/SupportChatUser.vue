<template>
  <div class="schat-user">
    <div v-if="!!user" class="chat">
      <div class="chat-groups">
        <div class="spy" ref="spyElement"></div>
        <div
          v-for="(item, i) in datedMessagesGroups"
          :key="i"
          class="dated-group"
        >
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

const { $echo } = useNuxtApp()

const { user } = useSanctumAuth()

const { $afFetch } = useNuxtApp()

const spyElement = useTemplateRef<HTMLElement>('spyElement')

const sending = ref(false)

const [{ list: messages }] = await Promise.all([
  usePaginationLazyWrapper<ISupportChatMessage>(
    spyElement,
    'support-chat/user/history',
    {
      credentials: 'include',
    }
  ),
])

const datedMessagesGroups = computed(() => {
  const formatted: { date: string; groups: ISupportChatMessage[][] }[] = []

  let currentGroupDayAndMonth: string = ''
  messages.value.reverse().forEach((message) => {
    const date = new Date(message.created_at)
    const messageDayAndMonth = `${date.getDate()}.${date.getMonth()}`
    if (messageDayAndMonth !== currentGroupDayAndMonth)
      formatted.push({ date: message.created_at, groups: [] })

    const groups = formatted[formatted.length - 1].groups
    let lastGroup = groups[groups.length - 1]
    if (!lastGroup) {
      lastGroup = []
      groups.push(lastGroup)
    }
    const lastMessage = lastGroup[lastGroup.length - 1]
    if (lastMessage && lastMessage.by_user !== message.by_user)
      groups.push([message])
    else lastGroup.push(message)

    currentGroupDayAndMonth = messageDayAndMonth
  })

  return formatted
})

async function send(message: string) {
  sending.value = true

  await $afFetch('support-chat/user/message', {
    method: 'POST',
    credentials: 'include',
    body: {
      message,
    },
  })

  sending.value = false
}
</script>

<style lang="scss" scoped>
.schat-user {
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
  }

  .chat-groups {
    overflow: auto;
    max-height: 400px;
  }

  .dated-group {
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
}
</style>
