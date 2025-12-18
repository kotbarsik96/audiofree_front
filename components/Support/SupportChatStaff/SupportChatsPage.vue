<template>
  <div class="support-chats _page">
    <div class="_container">
      <div class="_page-header">
        <BreadCrumbs />
      </div>
      <div class="main">
        <SupportChatsList class="list" />
        <div class="chat">
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '~/components/_UI/BreadCrumbs.vue'
import { supportChatsListBreadcrumbs } from '~/domain/breadcrumbs/pages/support'
import { useBreadcrumbs } from '~/domain/breadcrumbs/useBreadcrumbs'
import SupportChatsList from '~/components/Support/SupportChatStaff/_Sections/SupportChatsList.vue'

useBreadcrumbs(supportChatsListBreadcrumbs)
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.support-chats {
  --border: 1px solid var(--gray-700);

  margin-block-end: 3.75rem;

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.625rem;

    .input-wrapper {
      flex: 1 1 auto;
    }
  }

  .main {
    border-radius: 10px;
    border: var(--border);
    margin-block-start: 2rem;
    display: grid;
    grid-template-columns: 400px 1fr;
    overflow: hidden;
  }

  .list {
    border-right: var(--border);
  }

  .chat {
    min-width: 0;
  }
}
</style>
