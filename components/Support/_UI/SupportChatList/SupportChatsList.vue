<template>
  <div class="sc-list _section-box">
    <div v-if="chatsData" class="table-wrap">
      <table class="list-table">
        <thead>
          <tr>
            <th class="--id">id пользователя | чата</th>
            <th class="--name">ФИО</th>
            <th class="--email">Email</th>
            <th class="--telegram">Telegram</th>
          </tr>
        </thead>
        <tbody>
          <SupportChatsListRow v-for="chat in chats" :chat="chat" />
        </tbody>
      </table>
    </div>
    <div class="wrap">
      <AFPagination
        v-if="chatsData"
        :total="chatsData?.total"
        :per-page="chatsData.per_page"
        :disabled="isLoading"
      />

      <div v-if="chats.length < 1" class="empty">
        <BoxIcon />
        <p>Ничего не найдено</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AFPagination from '~/components/_UI/AFPagination.vue'
import SupportChatsListRow from '~/components/Support/_UI/SupportChatList/SupportChatsListRow.vue'
import BoxIcon from '~/assets/images/icons/empty-box.svg'
import type IPagination from '~/dataAccess/api/IPagination'
import type { ISupportChatsListItem } from '~/domain/chats/support-chat/interfaces/ISupportChatsListItem'

const [{ data: chatsData, status: chatsLoadingStatus, error }] =
  await Promise.all([
    useAPI<IPagination<ISupportChatsListItem>>('support-chat/chats-list', {
      credentials: 'include',
    }),
  ])

if (error.value?.statusCode && [401, 403].includes(error.value.statusCode)) {
  throw createError({
    statusCode: error.value.statusCode,
  })
}

const chats = computed(() => chatsData.value?.data || [])
const isLoading = computed(() => chatsLoadingStatus.value === 'pending')
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-list {
  &,
  &._section-box {
    max-width: var(--container-width);
    width: 100%;
    margin-inline: auto;
    padding: 0;
  }

  .table-wrap {
    width: 100%;
    overflow: auto;
  }

  .wrap {
    padding: 1rem;
  }

  .list-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 700px;

    thead {
      th {
        background-color: var(--gray-200);
        color: var(--gray-800);
        text-align: center;
        font: var(--text-14);
        font-weight: 600;
        border-right: 1px solid var(--gray-800);
        border-bottom: 1px solid var(--gray-800);
        padding: 0.25rem 1rem;

        &:first-child {
          border-top-left-radius: var(--sb-border-radius);
        }

        &.--id {
          width: 15%;
        }

        &.--name {
          width: 35%;
        }

        &.--email,
        &.--telegram {
          width: 30%;
        }

        &:last-child {
          border-top-right-radius: var(--sb-border-radius);
          border-right: 0;
        }
      }
    }
  }

  .empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;

    svg {
      width: 2.5rem;
      aspect-ratio: 1;
    }

    p {
      font: var(--text-h3);
      text-align: center;
    }
  }
}
</style>
