<template>
  <div class="sc-system-message" ref="element">
    {{ message.text }}
  </div>
</template>

<script setup lang="ts">
import { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'
import { getChatBodyElement } from '~/domain/support/chat/utils'
import { useSupportChatStaffStore } from '~/stores/supportChat/supportChatStaffStore'
import { useSupportChatUserStore } from '~/stores/supportChat/supportChatUserStore'

const props = defineProps<{
  message: ISupportChatMessage
  currentSenderType: ESupportChatSenderType
}>()

const element = useTemplateRef<HTMLElement>('element')

const store =
  props.currentSenderType === ESupportChatSenderType.User
    ? useSupportChatUserStore()
    : useSupportChatStaffStore()
const { readMessage } = store

useIntersectionObserver(
  element,
  (entries) => {
    if (entries.find((entry) => entry.isIntersecting)) {
      readMessage(props.message.id)
      /** отключить observer */
      return true
    }
  },
  () => ({
    root: getChatBodyElement(element.value),
    threshold: 0.75,
  }),
)
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-system-message {
  text-align: center;
  font: var(--text-18);
  color: var(--gray-700);
  margin-inline: auto;
}
</style>
