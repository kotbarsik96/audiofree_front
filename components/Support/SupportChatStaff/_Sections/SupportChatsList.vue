<template>
  <div class="sc-list">
    <div class="search-block">
      <InputWrapper
        class="input-wrapper"
        label="Поиск (email, телефон, ФИО)"
        input-id="search-filter"
      >
        <TextInput v-model="search" id="search-filter" />
      </InputWrapper>
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
import InputWrapper from '~/components/_UI/FormElements/InputWrapper.vue'
import TextInput from '~/components/_UI/FormElements/TextInput.vue'
import SupportChatStaffLink from '~/components/Support/SupportChatStaff/_Blocks/SupportChatStaffLink.vue'
import type { ISupportChatListItem } from '~/domain/support/chat/interfaces/ISupportChatListItem'
import { useSupportChatStaffStore } from '~/stores/supportChat/supportChatStaffStore'

const spyElement = useTemplateRef<HTMLElement>('spyElement')

const search = ref('')

const supportChatStaffStore = useSupportChatStaffStore()
const { chatsList, chatsListTrigger } = storeToRefs(supportChatStaffStore)

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
      },
    }
  )

if (error.value) {
  throw createError(error.value)
}

const refetch = debounce(reset, 500)

watch(search, refetch)
watch(chatsListTrigger, fullRefresh)
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
