<template>
  <div class="sc-list">
    <div class="search-block">
      <InputWrapper
        class="sb-input"
        label="Поиск (email, телефон, ФИО)"
        input-id="search-filter"
      >
        <TextInput v-model="search" id="search-filter" />
      </InputWrapper>
      <AFSelect
        class="sb-select"
        :options="supportChatStatusOptions"
        placeholder="Статус"
        v-model="_status"
      />
    </div>
    <div class="list">
      <SupportChatStaffLink
        v-for="chat in chatsList"
        :key="chat.id"
        :chat="chat"
      />
      <div class="spy" ref="spyElement"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AFSelect from '~/components/_UI/AFSelect.vue'
import InputWrapper from '~/components/_UI/FormElements/InputWrapper.vue'
import TextInput from '~/components/_UI/FormElements/TextInput.vue'
import SupportChatStaffLink from '~/components/Support/SupportChatStaff/_Blocks/SupportChatStaffLink.vue'
import {
  ESupportChatStatus,
  supportChatStatusOptions,
} from '~/domain/support/chat/interfaces/ESupportChatStatus'
import type { ISupportChatListItem } from '~/domain/support/chat/interfaces/ISupportChatListItem'
import type { ISupportChatWriteStatusChangeEvent } from '~/domain/support/chat/interfaces/ISupportChatWriteStatusChangeEvent'
import { useSupportChatStaffStore } from '~/stores/supportChat/supportChatStaffStore'

const spyElement = useTemplateRef<HTMLElement>('spyElement')

const echo = useEcho()

const _status = ref<ESupportChatStatus | 'all'>('all')
const status = computed(() =>
  _status.value === 'all' ? undefined : _status.value
)
const search = ref('')

const supportChatStaffStore = useSupportChatStaffStore()
const { chatsList, cachedChats } = storeToRefs(supportChatStaffStore)

const { error, reset, fullRefresh } =
  await usePaginationLazyWrapper<ISupportChatListItem>(
    chatsList,
    spyElement,
    '/support-chat/list',
    {
      credentials: 'include',
      watch: false,
      query: {
        search,
        status,
      },
    }
  )

if (error.value) {
  throw createError(error.value)
}

const refetch = debounce(reset, 500)
watch(() => [search.value, status.value], refetch)

const channelName = 'support-chats-list'

onMounted(() => {
  echo
    .private(channelName)
    .listen('.support-chat-message-created', fullRefresh)
    .listen(
      '.support-chat-write-status',
      (data: ISupportChatWriteStatusChangeEvent) => {
        fullRefresh()
        const cachedChat = cachedChats.value[data.chat_info.chat_id]
        if (cachedChat) cachedChat.chat_info = JSON.stringify(data.chat_info)
      }
    )
})

onUnmounted(() => {
  echo.leave(channelName)
})
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-list {
  --padding-inline: 1rem;

  display: flex;
  flex-direction: column;

  .search-block {
    padding-inline: var(--padding-inline);
    padding-block: 1rem;
    border-bottom: 1px solid var(--gray-200);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .list {
    padding-block: 1rem;
    padding-inline: var(--padding-inline);
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  @include mixins.adaptive(tablet-small) {
    .list {
      height: 300px;
    }
  }
}
</style>
