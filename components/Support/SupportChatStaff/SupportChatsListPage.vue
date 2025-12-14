<template>
  <div class="sc-list _page">
    <div class="_container">
      <div class="_page-header">
        <BreadCrumbs />
        <div class="filters">
          <InputWrapper label="ФИО" input-id="user_name">
            <TextInput
              v-model="userName"
              placeholder="ФИО пользователя"
              id="user_name"
            />
          </InputWrapper>
          <InputWrapper label="Email" input-id="user_email">
            <TextInput
              v-model="userEmail"
              placeholder="Email пользователя"
              id="user_email"
            />
          </InputWrapper>
          <InputWrapper label="Телефон" input-id="user_phone">
            <TextInput
              v-model="userPhoneNumber"
              placeholder="Телефон пользователя"
              id="user_phone"
            />
          </InputWrapper>
        </div>
      </div>
      <div class="list-wrap">
        <table class="list">
          <thead>
            <tr>
              <th>ID / создан</th>
              <th>Имя пользователя</th>
              <th>Эл. почта</th>
              <th>Телефон</th>
              <th>Текст последнего сообщения</th>
            </tr>
          </thead>
          <tbody>
            <SupportChatsListRow
              v-for="chat in chats"
              :key="chat.id"
              :chat="chat"
            />
          </tbody>
        </table>
      </div>
      <AFPagination
        v-if="pagination"
        :total="pagination.total"
        :per-page="perPage"
        :disabled="isLoading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '~/components/_UI/BreadCrumbs.vue'
import AFPagination from '~/components/_UI/AFPagination.vue'
import SupportChatsListRow from '~/components/Support/SupportChatStaff/_Blocks/SupportChatsListRow.vue'
import type IPagination from '~/dataAccess/api/IPagination'
import { supportChatsListBreadcrumbs } from '~/domain/breadcrumbs/pages/support'
import { useBreadcrumbs } from '~/domain/breadcrumbs/useBreadcrumbs'
import type { ISupportChatListItem } from '~/domain/support/chat/interfaces/ISupportChatListItem'
import InputWrapper from '~/components/_UI/FormElements/InputWrapper.vue'
import TextInput from '~/components/_UI/FormElements/TextInput.vue'

useBreadcrumbs(supportChatsListBreadcrumbs)

const route = useRoute()

const perPage = 10

const userName = ref('')
const userEmail = ref('')
const userPhoneNumber = ref('')
const page = computed(() => Number(route.query.page ?? '1'))

const { data, error, refresh, status } = await useAPI<{
  data: IPagination<ISupportChatListItem>
}>('/support-chat/list', {
  query: {
    user_name: userName,
    user_email: userEmail,
    user_phone_number: userPhoneNumber,
    page,
    per_page: perPage,
  },
  watch: false,
  credentials: 'include',
})

if (error.value) {
  throw createError(error.value)
}

const pagination = computed(() => data.value?.data)
const chats = computed(() => pagination.value?.data)
const isLoading = computed(() => status.value === 'pending')

const refetch = debounce(refresh, 500)

watch([userName, userEmail, userPhoneNumber], () => {
  refetch()
})
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-list {
  margin-block-end: 3.75rem;

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;

    .input-wrapper {
      flex: 1 1 auto;
    }
  }

  .list-wrap {
    width: 100%;
    overflow: auto;
    border-radius: 10px;
    border: 1px solid var(--gray-900);
    margin-block: 4rem;
    scrollbar-width: 4px;
  }

  .list {
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;

    :deep(th) {
      background-color: var(--gray-200);
      color: var(--gray-900);
      padding: 0.625rem 1rem;
      text-align: center;
      font: var(--text-18);
    }

    :deep(td) {
      text-align: left;
      padding: 0.625rem;
      font: var(--text-16);
      color: var(--gray-700);
    }

    :deep(th),
    :deep(td) {
      border-right: 1px solid var(--gray-900);
      border-top: 1px solid var(--gray-900);
    }

    tr:first-child {
      :deep(th),
      :deep(td) {
        border-top: 0;
      }
    }

    :deep(th:last-child),
    :deep(td:last-child) {
      border-right: 0;
    }
  }
}
</style>
