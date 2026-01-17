<template>
  <div class="sc-message" :class="classes" ref="element">
    <div class="name">{{ name }}</div>
    <div class="text" v-html="purifiedText"></div>
    <div class="time-block">
      <time class="time" :datetime="createdAt">{{ createdAt }}</time>
      <time v-if="editedAt" class="time" :datetime="editedAt">
        (изменено: {{ editedAt }})
      </time>
      <div class="checkmarks">
        <CheckmarkIcon />
        <Transition name="fade-in">
          <CheckmarkIcon v-if="message.read_at" class="second" />
        </Transition>
      </div>
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
import CheckmarkIcon from '~/assets/images/icons/checkmark.svg?component'
import { getChatBodyElement } from '~/domain/support/chat/utils'
import { useSupportChatUserStore } from '~/stores/supportChat/supportChatUserStore'
import { useSupportChatStaffStore } from '~/stores/supportChat/supportChatStaffStore'

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
const { chatInfo } = storeToRefs(store)

const isOpposite = computed(
  () => props.currentSenderType !== props.message.sender_type
)

const name = computed(() => {
  let n =
    supportChatSenderTypeMap[
      props.message.sender_type as ESupportChatSenderType
    ]

  if (
    props.message.sender_type === ESupportChatSenderType.User &&
    chatInfo.value
  )
    n = chatInfo.value.user_name

  return n
})

const purifiedText = computed(() =>
  typeof window !== 'undefined'
    ? DOMPurify.sanitize(props.message.text)
    : props.message.text
)

const createdAt = computed(() => formatTime(props.message.created_at))
const editedAt = computed(() => {
  if (!props.message.edited_at) return null
  else return formatTime(props.message.edited_at, true)
})

const classes = computed(() => ({
  '--opposite': isOpposite.value,
  '--is-read': !!props.message.read_at,
}))

let intersectionObserver: IntersectionObserver | undefined

onMounted(() => {
  setIntersectionObserver()
})

onUnmounted(() => {
  intersectionObserver?.disconnect()
})

function setIntersectionObserver() {
  if (isOpposite.value && element.value && !props.message.read_at) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries.find((entry) => entry.isIntersecting)) {
          readMessage(props.message.id)
          intersectionObserver?.disconnect
          intersectionObserver = undefined
        }
      },
      {
        root: getChatBodyElement(element.value),
        threshold: 0.75,
      }
    )
    intersectionObserver.observe(element.value)
  }
}

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
  max-width: var(--sc-max-message-width);
  border-radius: var(--sc-message-border-radius);
  padding: 0.5rem 1rem;
  background: var(--gray-100);
  box-shadow: 0px 0px 90px rgba(0, 0, 0, 0.05);

  .time-block {
    font: var(--text-14);
    color: var(--gray-500);
    text-align: right;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    min-width: 0;
  }

  .name {
    min-width: 0;
  }

  .text {
    margin-block: 0.5rem;
    overflow-wrap: break-word;
    min-width: 0;
  }

  .checkmarks {
    color: var(--gray-500);
    padding-inline-start: 0.25rem;
    display: flex;
    align-items: center;

    svg {
      width: 1rem;
    }

    .second {
      transform: translateX(-0.5rem);
    }
  }

  &.--is-read {
    .checkmarks {
      color: var(--primary);
    }
  }
}
</style>
