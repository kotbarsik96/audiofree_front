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
          <ul class="footer__contacts-list">
            <li class="footer__contact-item">
              <FreeCall />
            </li>
            <li
              v-for="item in contacts"
              :key="item.title"
              class="footer__contact-item"
            >
              <ButtonIcon :icon="item.icon" />
              <div>
                <div class="footer__contact-item-title">{{ item.title }}</div>
                <div class="footer__contact-item-detail">{{ item.detail }}</div>
              </div>
            </li>
          </ul>
          <SocialsList class="footer__socials" />
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <div class="footer__bottom-container _container">
        <div>© 2024 audiofree.ru Все права защищены</div>
        <div>
          <LogoText hideText link />
        </div>
        <div>
          <NuxtLink class="_link _link--white" to="/">
            Политика конфиденциальности
          </NuxtLink>
        </div>
      </div>
    </div>

    <AuthDialog v-model:shown="authDialogShown" />
  </footer>
</template>

<script setup lang="ts">
import AuthDialog from '~/components/Blocks/Dialog/AuthDialog.vue'
import SocialsList from '~/components/Blocks/SocialsList.vue'
import contacts from '@/enums/footer/contacts'
import FreeCall from '~/components/Blocks/FreeCall.vue'
import ButtonIcon from '~/components/Blocks/ButtonIcon.vue'
import LogoText from '~/components/Blocks/LogoText.vue'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const { tab } = storeToRefs(useAuthStore())

const authDialogShown = ref(false)

const columns = [
  {
    title: 'Личный кабинет',
    items: [
      {
        title: 'Войти в аккаунт',
        action: login,
      },
      {
        title: 'Зарегистрироваться',
        action: signup,
      },
      {
        title: 'Отложенные товары',
        to: '/favorites',
      },
      {
        title: 'Ваши заказы',
        to: '/profile',
      },
    ],
  },
  {
    title: 'Магазин',
    items: [
      {
        title: 'Доставка и оплата',
        to: '/delivery-payment',
      },
      {
        title: 'Гарантия и возврат',
        to: '/guarantees-refund',
      },
      {
        title: 'Пункты самовывоза',
        to: '/pickup-places',
      },
      {
        title: 'Контакты',
        to: '/contacts',
      },
    ],
  },
]

function signup() {
  tab.value = 'signup'
  authDialogShown.value = true
}
function login() {
  tab.value = 'login'
  authDialogShown.value = true
}
</script>

<style lang="scss" scoped>
.footer {
  color: var(--white);

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
    @include fontSize(14);
  }

  &__column-title {
    @include fontSize(18);
    font-weight: 500;
    margin-bottom: 50px;
  }

  &__contacts-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  &__contact-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;

    :deep(.free-call__title) {
      color: var(--white);
    }
    :deep(.free-call__number) {
      color: var(--white);
    }

    :deep(.icon),
    .icon {
      color: var(--primary-dark);
    }

    :deep(.btn-icon) {
      background-color: var(--secondary);
    }
    :deep(.btn-icon):hover {
      background-color: var(--secondary-2);
    }
  }

  &__contact-item-title {
    @include fontSize(14);
  }

  &__contact-item-detail {
    @include fontSize(14);
    font-weight: 700;
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
    @include fontSize(14);
  }

  @include adaptive(tablet-big) {
    &__main {
      padding: 2.375rem 0 1.125rem 0;
    }

    &__main-container {
      flex-direction: column;
      align-items: stretch;
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

    &__contacts-list {
      align-items: center;
    }

    &__contact-item {
      text-align: center;
      align-items: center;

      :deep(.btn-icon) {
        display: none;
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
