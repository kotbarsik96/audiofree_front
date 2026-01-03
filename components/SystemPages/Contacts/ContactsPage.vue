<template>
  <div class="contacts _page">
    <div class="_container">
      <div class="_page-header">
        <BreadCrumbs />
      </div>
      <div class="_card main">
        <div class="_card__inner main-inner">
          <div class="list-wrap">
            <h1 class="_h1 title">Контакты</h1>
            <ContactsList />
          </div>
          <LogInToSeePage class="chat-wrap">
            <SupportChatUser />
          </LogInToSeePage>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '~/components/_UI/BreadCrumbs.vue'
import ContactsList from '~/components/SystemPages/Contacts/_Blocks/ContactsList.vue'
import SupportChatUser from '~/components/Support/SupportChat/_Blocks/SupportChatUser.vue'
import LogInToSeePage from '~/components/Auth/_Blocks/LogInToSeePage.vue'
import { useBreadcrumbs } from '~/domain/breadcrumbs/useBreadcrumbs'
import { contactsBreadcrumbs } from '~/domain/breadcrumbs/pages'

useBreadcrumbs(contactsBreadcrumbs)
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.contacts {
  margin-bottom: 3.75rem;

  .main {
    margin-block-start: 1rem;

    .main-inner {
      display: grid;
      grid-template-columns: 400px 1fr;
      padding: 0;
    }

    .list-wrap {
      --padding-inline: 0.75rem;

      padding-block: 1rem;
      border-right: 1px solid var(--gray-200);
      min-width: 0;

      .title {
        padding-inline: var(--padding-inline);
      }

      .contacts-list {
        gap: 0;

        :deep(.contacts-list__contact-item) {
          padding-inline: var(--padding-inline);
          padding-block: 0.75rem 0.5rem;

          &:not(:last-child) {
            border-bottom: 1px solid var(--gray-200);
          }
        }
      }
    }

    .chat-wrap {
      height: 60vh;
      min-height: 500px;
      min-width: 0;
    }
  }

  @include mixins.adaptive(tablet-big) {
    .main {
      .main-inner {
        grid-template-columns: 1fr;
      }

      .list-wrap {
        border-right: 0;
        border-bottom: 1px solid var(--gray-200);
      }
    }
  }
}
</style>
