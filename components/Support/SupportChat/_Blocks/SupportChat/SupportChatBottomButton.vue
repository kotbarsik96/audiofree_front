<template>
  <button class="sc-bottom-btn" :aria-label="ariaLabel">
    <span class="inner">
      <ArrowUpIcon />
    </span>
    <Transition name="drop-down">
      <span v-if="unreadMessagesCount > 0" class="unread-count">
        {{ unreadMessagesText }}
      </span>
    </Transition>
  </button>
</template>

<script setup lang="ts">
import ArrowUpIcon from '~/assets/images/icons/arrow-up.svg?component'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'

const props = defineProps<{
  chatInfo: ISupportChatInfo
  chatBodyElement: HTMLElement | null
}>()

const unreadMessagesCount = computed(() => props.chatInfo.unread_messages)
const unreadMessagesText = computed(() => {
  let txt = ''

  if (unreadMessagesCount.value > 0 && unreadMessagesCount.value <= 9)
    txt = unreadMessagesCount.value.toString()
  else if (unreadMessagesCount.value > 9) txt = '9+'

  return txt
})

const ariaLabel = computed(() =>
  unreadMessagesCount.value > 0
    ? 'В конец чата (отметить все сообщения прочитанными)'
    : 'В конец чата'
)
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-bottom-btn {
  width: 2.5rem;
  height: auto;
  aspect-ratio: 1;
  background-color: var(--white);
  box-shadow: 0px 0px 50px rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  position: absolute;
  bottom: 4rem;
  left: 10px;
  outline: none;
  z-index: 20;
  transition: var(--general-transition);
  display: flex;
  justify-content: center;
  align-items: center;

  .inner {
    svg {
      width: 2rem;
      height: auto;
      aspect-ratio: 1;
      color: var(--primary);
      transform: rotate(180deg);
      transition: var(--general-transition);
    }
  }

  .unread-count {
    position: absolute;
    top: -10px;
    right: -10px;
    border-radius: 50%;
    width: 25px;
    height: auto;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    font-size: 14px;
    background-color: var(--secondary);
  }

  &.--visible {
    display: flex;
    opacity: 1;
    animation-name: scBottomBtnShow;
  }

  &:hover {
    background-color: var(--primary);

    .inner {
      svg {
        color: var(--white);
      }
    }
  }
}
</style>
