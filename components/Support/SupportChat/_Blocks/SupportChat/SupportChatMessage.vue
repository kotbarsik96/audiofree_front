<template>
  <div class="sc-message" :class="classes"></div>
</template>

<script setup lang="ts">
import {
  ESupportChatSenderType,
  supportChatSenderTypeMap,
} from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'

const props = defineProps<{
  message: ISupportChatMessage
  currentSenderType: ESupportChatSenderType
}>()

const isOpposite = computed(
  () => props.currentSenderType !== props.message.sender_type
)

const name = computed(() => {
  let n = supportChatSenderTypeMap[props.message.sender_type]

  if (!isOpposite.value) {
    if (props.currentSenderType === ESupportChatSenderType.User) n = 'Вы'
  }
  
  return n
})

const classes = computed(() => ({
  '--opposite': isOpposite.value,
}))
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
</style>
