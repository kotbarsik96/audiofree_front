<template>
  <NuxtLink class="scs-link" :class="classes" :to="link">
    <div class="credentials">
      <div class="name">
        {{ chat.user_name }}
      </div>
      <div class="contacts">({{ contactsString }})</div>
    </div>
    <div class="latest-message">
      <Transition name="drop-down" mode="out-in">
        <div v-if="chat.writers_count > 0" class="is-writing">
          ({{ writingStatusString }}
          <SupportChatThreeDots />
          )
        </div>
        <div v-else>{{ chat.latest_message?.slice(0, 250) }}</div>
      </Transition>
    </div>
    <div class="status">
      <div class="s-dot"></div>
      <div class="s-text">
        {{ status }}
        {{ unreadMessagesString }}
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import SupportChatThreeDots from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatThreeDots.vue'
import {
  ESupportChatStatus,
  supportChatStatusMap,
} from '~/domain/support/chat/interfaces/ESupportChatStatus'
import type { ISupportChatListItem } from '~/domain/support/chat/interfaces/ISupportChatListItem'

const props = defineProps<{
  chat: ISupportChatListItem
}>()

const link = computed(() => ({
  name: 'SupportChatStaffPage',
  params: {
    id: props.chat.id,
  },
}))

const contactsString = computed(() =>
  [props.chat.user_email, props.chat.user_telegram, props.chat.user_phone]
    .filter((str) => !!str)
    .join(' / ')
)

const writingStatusString = computed(() => {
  if (props.chat.writers_count < 1) return null
  if (props.chat.writers_count === 1) return 'печатает'
  if (props.chat.writers_count > 1)
    return `${props.chat.writers_count} печатают`
})

const status = computed(() => supportChatStatusMap[props.chat.status])

const unreadMessagesString = computed(() => {
  let str = ''
  if (props.chat.unread_messages > 0) str = `(непр.: ${props.chat.unread_messages})`
  return str
})

const classes = computed(() => ({
  '--closed': props.chat.status === ESupportChatStatus.Closed,
  '--open': props.chat.status === ESupportChatStatus.Open,
}))
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.scs-link {
  padding: 0.625rem 1rem;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  border-radius: 8px;
  background-color: var(--gray-100);
  transition: var(--general-transition);
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);

  .credentials {
    display: flex;
    flex-direction: column;
    gap: 0.325rem;
    margin-block-end: 0.625rem;

    .name {
      font: var(--text-18);
      color: var(--gray-800);
      font-weight: 500;
    }

    .contacts {
      font: var(--text-14);
      color: var(--gray-600);
    }
  }

  .latest-message {
    color: var(--gray-800);
    font: var(--text-18);
    min-width: 0;
    overflow-wrap: break-word;
    @include mixins.lines(1);
  }

  .is-writing {
    --color: var(--gray-700);

    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--color);

    .three-dots {
      :deep(.three-dots-dot) {
        background-color: var(--color);
      }
    }
  }

  .status {
    margin-block-start: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .s-text {
      font: var(--text-16);
      color: var(--gray-600);
      font-weight: 500;
    }

    .s-dot {
      border-radius: 50%;
      width: 0.5rem;
      height: auto;
      aspect-ratio: 1;
    }
  }

  &.--closed {
    .status {
      .s-dot {
        background-color: var(--red);
      }
    }
  }

  &.--open {
    .status {
      .s-dot {
        background-color: var(--secondary-2);
      }
    }
  }

  &:hover {
    background-color: var(--gray-200);
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0);
  }
}

@keyframes dotAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
