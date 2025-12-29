<template>
  <div class="sc-header">
    <div class="name">{{ name }}</div>
    <div class="is-writing">
      <Transition name="drop-down">
        <div v-if="writersString" class="iw-inner">
          <div>{{ writersString }}</div>
          <SupportChatThreeDots />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import SupportChatThreeDots from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatThreeDots.vue'
import { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import type IUser from '~/domain/user/types/IUser'

const user = useSanctumUser<IUser>()

const props = defineProps<{
  currentSenderType: ESupportChatSenderType
  chatInfo: ISupportChatInfo | undefined
}>()

const writers = computed(() => {
  const arr = []

  if (props.currentSenderType === ESupportChatSenderType.User) {
    if (props.chatInfo?.staff_writing) arr.push('сотрудник')
  } else {
    if (props.chatInfo?.user_writing) arr.push(props.chatInfo.user_name)
    const staffWriters = props.chatInfo?.staff_writers?.filter(
      (writer) => writer !== user.value?.name
    )
    if (staffWriters && staffWriters.length > 0) arr.push(...staffWriters)
  }

  return arr
})

const writersString = computed(() => {
  if (writers.value.length < 1) return null
  return `${writers.value.join(', ')} ${
    writers.value.length > 1 ? 'печатают' : 'печатает'
  }`
})

const name = computed(() => {
  if (props.currentSenderType === ESupportChatSenderType.User)
    return 'Техническая поддержка'
  else return props.chatInfo?.user_name ?? 'Пользователь'
})
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-header {
  padding-block: 0.5rem;
  padding-inline: 1rem;
  box-shadow: 9px 2px 9px rgba(0, 0, 0, 0.05);

  .name {
    font: var(--text-16);
    font-weight: 500;
  }

  .is-writing {
    min-height: 1.25rem;
    font: var(--text-16);
    color: var(--gray-700);

    .iw-inner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
}
</style>
