<template>
  <div class="contacts _page">
    <div class="_container">
      <div class="_page-header">
        <BreadCrumbs />
      </div>
      <div class="_card contacts__box">
        <div class="_card__inner contacts__box-inner">
          <div class="contacts__box-contacts">
            <h1 class="_h1 contacts__box-contacts-title">Контакты</h1>
            <ContactsList />
          </div>
          <div class="contacts__box-chat">
            <!-- в разработке... -->
            <SupportChatUser />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumbs from '~/components/_UI/BreadCrumbs.vue'
import ContactsList from '~/components/SystemPages/Contacts/Blocks/ContactsList.vue'
import SupportChatUser from '~/components/Support/SupportChat/Blocks/SupportChatUser.vue'

const { setBreadcrumbs } = useBreadcrumbs()
setBreadcrumbs([
  {
    index: 2,
    label: 'Контакты',
    link: { name: 'ContactsPage' },
  },
])

const { data } = await useAPI<{ data: IPageSeo }>('page/contacts')
usePageMeta(data)
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.contacts {
  --cp-padding-x: 1.875rem;
  --cp-padding-y: 1.875rem;

  margin-bottom: 3.75rem;

  &__box {
    margin-top: 1.125rem;
  }

  &__box-inner {
    padding: 0;
    display: flex;
  }

  &__box-contacts {
    margin-right: var(--cp-padding-x);
    border-right: 2px solid var(--stroke);

    :deep(.contacts-list__contact-item) {
      border-bottom: 1px solid var(--stroke);
      padding: 0 var(--cp-padding-x) 1rem var(--cp-padding-x);

      &:last-child {
        border-bottom: 0;
      }
    }
  }

  &__box-contacts-title {
    padding: var(--cp-padding-y) var(--cp-padding-x);
  }

  &__box-chat {
    flex: 1 1 auto;
    padding: var(--cp-padding-y) var(--cp-padding-x);
    padding-left: 0;
  }

  @include mixins.adaptive(tablet-big) {
    &__box {
      &::before {
        display: none;
      }
    }

    &__box-contacts-title {
      padding-left: 0;
      padding-right: 0;
    }

    &__box-inner {
      background: transparent;
      box-shadow: none;
      flex-direction: column;
    }

    &__box-contacts {
      border-right: none;
      border-bottom: 1px solid var(--stroke);
      margin-right: 0;
    }
  }
}
</style>
