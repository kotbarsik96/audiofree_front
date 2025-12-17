<template>
  <div class="sc-message" :class="classes">
    <div class="name">{{ name }}</div>
    <div class="text" v-html="purifiedText"></div>
    <div class="time-block">
      <time class="time" :datetime="createdAt">{{ createdAt }}</time>
      <time v-if="updatedAt" class="time" :datetime="updatedAt">
        (изменено: {{ updatedAt }})
      </time>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ESupportChatSenderType,
  supportChatSenderTypeMap,
} from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'
import DOMPurify from 'dompurify'

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

const purifiedText = computed(() => DOMPurify.sanitize(props.message.text))

const createdAt = computed(() => formatTime(props.message.created_at))
const updatedAt = computed(() => {
  if (props.message.created_at === props.message.updated_at) return null
  else return formatTime(props.message.updated_at, true)
})

const classes = computed(() => ({
  '--opposite': isOpposite.value,
}))

function formatTime(time: string, withDate?: boolean) {
  const date = new Date(time)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const dayAndMonth = `${day < 10 ? '0' + day : day}.${
    month + 1 < 10 ? '0' + month : month
  }`
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${withDate ? dayAndMonth + ' ' : ''}${
    hours < 10 ? '0' + hours : hours
  }:${minutes < 10 ? '0' + minutes : minutes}`
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-message {
  border-radius: 8px;
  padding: 0.5rem 1rem;
  background: var(--gray-50);
}
</style>
