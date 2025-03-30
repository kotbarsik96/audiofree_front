<template>
  <footer class="footer">
    <div class="footer__main">
      <div class="footer__main-container _container">
        <div
          v-for="column in columns"
          :key="column.title"
          class="footer__column"
        >
          <div class="footer__column-title">
            {{ column.title }}
          </div>
          <ul>
            <li v-for="item in column.items" :key="item.title">
              <NuxtLink
                class="footer__column-link _link _link--white"
                v-if="item.to"
                :to="item.to"
                tabindex="0"
              >
                {{ item.title }}
              </NuxtLink>
              <button
                v-else-if="item.action"
                class="footer__column-link _link _link--white"
                type="button"
                @click="item.action"
              >
                {{ item.title }}
              </button>
            </li>
          </ul>
        </div>
        <div class="footer__column">
          <div class="footer__column-title">Контакты</div>
          <ContactsList class="footer__contacts" />
          <SocialsList class="footer__socials" />
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <div class="footer__bottom-container _container">
        <div>© {{ currentYear }} audiofree.ru Все права защищены</div>
        <div>
          <LogoText hideText link />
        </div>
        <div>
          <NuxtLink class="_link _link--white" to="/" tabindex="0">
            Политика конфиденциальности
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import SocialsList from '~/components/Blocks/SocialsList.vue'
import LogoText from '~/components/Blocks/LogoText.vue'
import ContactsList from '~/components/Blocks/ContactsList.vue'
import { useAuthStore } from '@/stores/authStore'
import type { RouteLocationRaw } from 'vue-router'

const { openSignupDialog, openLoginDialog } = useAuthStore()

interface IFooterColumn {
  title: string
  items: {
    title: string
    action?: (payload: Event) => void
    to?: RouteLocationRaw
  }[]
}

const currentYear = new Date().getFullYear()

const columns: IFooterColumn[] = [
  {
    title: 'Личный кабинет',
    items: [
      {
        title: 'Войти в аккаунт',
        action: openLoginDialog,
      },
      {
        title: 'Зарегистрироваться',
        action: openSignupDialog,
      },
      {
        title: 'Отложенные товары',
        to: { name: 'FavoritesPage' },
      },
      {
        title: 'Ваши заказы',
        to: { name: 'ProfilePage' },
      },
    ],
  },
  {
    title: 'Магазин',
    items: [
      {
        title: 'Доставка и оплата',
        to: { name: 'DeliveryPaymentPage' },
      },
      {
        title: 'Гарантия и возврат',
        to: { name: 'GuaranteesRefundPage' },
      },
      {
        title: 'Контакты',
        to: { name: 'ContactsPage' },
      },
    ],
  },
]
</script>

<style lang="scss" scoped>
.footer {
  color: var(--white);

  a,
  button {
    outline-color: var(--white);
  }

  &__main {
    padding: 4.375rem 0 3.125rem 0;
    background-color: var(--primary-dark);
  }

  &__main-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.875rem;
  }

  &__column-link {
    @include fontSize(16);
  }

  &__column-title {
    @include fontSize(18);
    font-weight: 500;
    margin-bottom: 50px;
  }

  &__contacts {
    :deep(.contacts-list__contact-item) {
      .free-call__title {
        color: var(--white);
      }
      .free-call__number {
        color: var(--white);
      }

      .icon {
        color: var(--primary-dark);
      }
    }
  }

  &__socials {
    margin-top: 17px;
    padding-left: 50px;
  }

  &__bottom {
    background-color: #180e35;
    padding: 10px 0 15px 0;
  }

  &__bottom-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include fontSize(16);
  }

  @include adaptive(tablet-big) {
    &__main {
      padding: 2.375rem 0 1.125rem 0;
    }

    &__main-container {
      flex-direction: column;
      align-items: stretch;
    }

    &__contacts {
      align-items: center;

      :deep(.contacts-list__contact-item) {
        .btn-icon {
          display: none;
        }
      }
    }

    &__column {
      border-bottom: 1px solid var(--border-footer-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 1.875rem;
      margin: 0 var(--container-unpadding);

      &:last-child {
        border-bottom: 0;
        padding-bottom: 0;
      }
    }

    &__column-title {
      @include fontSize(24);
      margin-bottom: 1.5rem;
    }

    &__column {
      text-align: center;
    }

    &__socials {
      padding-left: 0;
    }

    &__bottom {
      border-top: 1px solid var(--border-footer-color);
      background-color: var(--primary-dark);
      padding-top: 0;
    }

    &__bottom-container {
      flex-direction: column;
      align-items: stretch;

      > div {
        padding: 0.625rem 0;
        margin: 0 var(--container-unpadding);
        border-bottom: 1px solid var(--border-footer-color);
        text-align: center;

        :deep(.logo-text) {
          display: inline-flex;
          margin: 0 auto;
        }

        &:nth-child(2) {
          padding-bottom: 0.325rem;
        }
        &:last-child {
          border-bottom: 0;
          align-items: center;
        }
      }
    }
  }
}
</style>
