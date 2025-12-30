<template>
  <div class="sc-messages-group" :class="classes">
    <div class="avatar">
      <component v-if="avatarIcon" :is="avatarIcon" />
    </div>
    <div class="list">
      <template v-for="message in messagesGroup.messages" :key="message.id">
        <SupportChatMessage
          v-if="message.sender_type !== 'system'"
          :message="message"
          :current-sender-type="currentSenderType"
        />
        <SupportChatSystemMessage
          v-else
          :message="message"
          :current-sender-type="currentSenderType"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import SupportChatMessage from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatMessage.vue'
import SupportChatSystemMessage from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatSystemMessage.vue'
import { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import SupportIcon from '~/assets/images/icons/support.svg?component'
import UserIcon from '~/assets/images/icons/user.svg?component'
import type { ISupportChatMessagesSenderGroup } from '~/composables/useSupportChat'
import type { Component } from 'vue'

const props = defineProps<{
  messagesGroup: ISupportChatMessagesSenderGroup
  currentSenderType: ESupportChatSenderType
}>()

const avatarMap: Record<ESupportChatSenderType, Component> = {
  [ESupportChatSenderType.Staff]: SupportIcon,
  [ESupportChatSenderType.User]: UserIcon,
}

const avatarIcon = computed(() => avatarMap[props.messagesGroup.sender_type])

const isRight = computed(
  () => props.currentSenderType === props.messagesGroup.sender_type
)

const classes = computed(() => ({
  '--right': isRight.value,
}))
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-messages-group {
  display: flex;
  gap: 1rem;
  width: 100%;

  .avatar {
    svg {
      position: sticky;
      top: 10px;
      aspect-ratio: 1;
      width: 25px;
      height: auto;
    }
  }

  .list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--sc-list-gap);
  }

  &.--right {
    justify-content: flex-end;

    .list {
      order: 1;
      align-items: flex-end;
    }

    .avatar {
      order: 2;
    }
  }

  @include mixins.adaptive(tablet-big) {
    .list {
      width: 90%;
    }
  }
}
</style>
