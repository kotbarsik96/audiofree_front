<template>
  <div class="sc-message" :class="classes" ref="element">
    <div v-if="isFirst" class="author-name">
      <template v-if="userPov">
        {{ message.by_user ? user?.name || 'Вы' : 'Сотрудник тех.поддержки' }}
      </template>
      <template v-else>
        {{ message.by_user ? message.author : 'Сотрудник тех.поддержки' }}
      </template>
    </div>
    <div class="message">{{ message.message_text }}</div>
    <div class="bottom">
      <time class="time" :datetime="message.created_at">
        {{ formatTime(message.created_at) }}
      </time>
      <div class="checkmarks">
        <IconCheckmark />
        <Transition name="fade-in">
          <IconCheckmark v-if="message.was_read" />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISupportChatMessage } from '~/domain/chats/support-chat/interfaces/ISupportChatMessage'
import type IUser from '~/domain/user/types/IUser'
import { formatTime } from '~/utils/date'
import IconCheckmark from '~/assets/images/icons/checkmark.svg'

const props = defineProps<{
  message: ISupportChatMessage
  isFirst: boolean
  userPov?: boolean
  readMessages: number[]
}>()

const emit = defineEmits<{
  (e: 'update:readMessages', updated: number[]): void
}>()

const element = useTemplateRef<HTMLDivElement>('element')

const { user } = useSanctumAuth<IUser>()

const isMessageBySelf = computed(
  () =>
    (props.userPov && props.message.by_user) ||
    (!props.userPov && !props.message.by_user)
)

const classes = computed(() => ({
  '--was-read': props.message.was_read,
  '--right-sided': !isMessageBySelf.value,
}))

let intersectionObserver: IntersectionObserver | undefined

onMounted(() => {
  if (element.value && !isMessageBySelf.value && !props.message.was_read) {
    intersectionObserver = new IntersectionObserver(onIntersection, {
      threshold: 0.75,
    })
    intersectionObserver.observe(element.value)
  }
})

onUnmounted(() => {
  if (element.value) {
    intersectionObserver?.unobserve(element.value)
  }
})

function onIntersection(entries: IntersectionObserverEntry[]) {
  if (entries.find((entry) => entry.isIntersecting)) {
    props.message.was_read = true
    if (element.value) intersectionObserver?.unobserve(element.value)

    if (!props.readMessages.includes(props.message.id))
      emit('update:readMessages', [...props.readMessages, props.message.id])
  }
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-message {
  background-color: var(--white);
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.07);
  max-width: 400px;

  .author-name {
    font: var(--text-16);
    font-weight: 600;
    color: var(--gray-800);
    margin-block-end: 0.5rem;
  }

  .message {
    font: var(--text-14);
    color: var(--gray-700);
  }

  .bottom {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .time {
    display: block;
    width: 100%;
    text-align: right;
    color: var(--gray-600);
    font: var(--text-14);
  }

  .checkmarks {
    display: flex;
    align-items: center;

    svg {
      width: 1rem;
      aspect-ratio: 1;
      color: var(--gray-300);
      display: inline-block;
      transition: var(--general-transition);
    }
  }

  &.--was-read {
    .checkmarks {
      svg {
        color: var(--primary);
      }
    }
  }
}
</style>
