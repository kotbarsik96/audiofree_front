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
import { useSupportChatStaffStore } from '~/stores/supportChat/supportChatStaffStore'
import { useSupportChatUserStore } from '~/stores/supportChat/supportChatUserStore'

const user = useSanctumUser<IUser>()

const props = defineProps<{
  currentSenderType: ESupportChatSenderType
  chatInfo: ISupportChatInfo | undefined
}>()

const store =
  props.currentSenderType === ESupportChatSenderType.User
    ? useSupportChatUserStore()
    : useSupportChatStaffStore()
const { writersList } = storeToRefs(store)

const writers = computed(() => {
  let arr = []

  const writers = writersList.value.filter(
    (wr) => wr.chat_id === props.chatInfo?.chat_id && wr.id !== user.value?.id
  )

  if (props.currentSenderType === ESupportChatSenderType.User) {
    if (writers.length > 0) arr.push('сотрудник')
  } else {
    arr = writers.map((wr) => wr.name)
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
