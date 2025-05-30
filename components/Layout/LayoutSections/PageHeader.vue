<template>
  <header class="header" :class="headerClassName">
    <div class="header__desktop">
      <div class="header__top">
        <div class="header__container _container">
          <LogoText class="header__top-logo" link />
          <ul class="header__top-links">
            <li v-for="obj in topLinks">
              <NuxtLink
                class="header__top-link _link _link--white"
                :to="obj.to"
                tabindex="0"
              >
                {{ obj.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="header__main">
        <div class="header__container _container">
          <FreeCall />
          <InputWrapper
            class="header__search"
            rounded
            :icon="SearchIcon"
            iconPos="left"
          >
            <TextInput placeholder="Поиск товара" v-model="searchValue" />
          </InputWrapper>
          <ul class="header__main-icon-links">
            <li v-for="item in iconLinks" :key="item.icon">
              <ButtonIcon
                :icon="item.icon"
                type="router-link"
                :to="item.to"
                :badge="item.badge"
                shadow
              />
            </li>
          </ul>
        </div>
      </div>
      <div class="header__bottom">
        <div class="header__container _container">
          <div class="header__bottom-catalog">
            <NuxtLink
              class="_link _link--text-color"
              :to="{ name: 'CatalogPage' }"
              tabindex="0"
            >
              <AFIcon :icon="MenuIcon" />
              <span> Каталог товаров</span>
            </NuxtLink>
          </div>
          <ul class="header__bottom-links">
            <li v-for="link in bottomLinks">
              <NuxtLink
                :to="link.to"
                class="header__bottom-link"
                :class="{ '--bold': link.bold }"
                tabindex="0"
              >
                {{ link.title }}
              </NuxtLink>
            </li>
          </ul>
          <HeaderAuthBlock class="header__auth" />
        </div>
      </div>
    </div>
    <div class="header__mobile">
      <div class="header-mobile__search" :class="mobileSearchClassName">
        <button
          class="header-mobile__search-button"
          type="button"
          aria-label="Открыть поиск"
          @click="toggleMobileSearch"
        >
          <AFIcon :icon="SearchIcon" />
        </button>
        <div class="header-mobile__search-input-wrapper">
          <InputWrapper class="header-mobile__search-input">
            <TextInput placeholder="Поиск товара" v-model="searchValue" />
          </InputWrapper>
        </div>
      </div>
      <div class="header-mobile">
        <button
          class="header-mobile__menu-btn"
          type="button"
          aria-label="Открыть меню"
          ref="headerMobileMenuBtnEl"
          @click="toggleMenu"
        >
          <AFIcon :icon="MenuIcon" />
        </button>
        <div class="header-mobile__logo-wrapper">
          <LogoText class="header-mobile__logo" hideIcon hideText link />
        </div>
        <ul class="header-mobile__icons">
          <li v-for="item in iconLinks" :key="item.icon">
            <ButtonIcon
              :icon="item.icon"
              type="router-link"
              :to="item.to"
              :badge="item.badge"
            />
          </li>
        </ul>
      </div>
      <div class="header-mobile__menu-wrapper">
        <nav class="header-mobile__menu" v-click-away="closeMenu">
          <ul class="header-mobile__menu-list">
            <li class="header-mobile__menu-item">
              <button
                class="header-mobile__menu-item-inner --iconed --close"
                type="button"
                @click="closeMenu"
              >
                <AFIcon :icon="ChevronRightIcon" rotate="180deg" />
                <span>Меню</span>
              </button>
            </li>
            <li class="header-mobile__menu-item">
              <NuxtLink class="header-mobile__menu-item-inner --iconed" to="/">
                <AFIcon :icon="HeadphonesIcon" />
                <span>Главная</span>
              </NuxtLink>
            </li>
            <li class="header-mobile__menu-item">
              <NuxtLink
                class="header-mobile__menu-item-inner --iconed"
                :to="{ name: 'CatalogPage' }"
              >
                <AFIcon :icon="MenuIcon" />
                <span>Каталог</span>
              </NuxtLink>
            </li>
            <li class="header-mobile__menu-item">
              <HeaderAuthBlock class="header-mobile__auth-item --iconed" />
            </li>
            <li
              class="header-mobile__menu-item"
              v-for="item in topLinks"
              :key="item.title"
            >
              <NuxtLink class="header-mobile__menu-item-inner" :to="item.to">
                {{ item.title }}
              </NuxtLink>
            </li>
            <li
              v-for="item in bottomLinksMobile"
              :key="item.title"
              class="header-mobile__menu-item"
            >
              <NuxtLink class="header-mobile__menu-item-inner" :to="item.to">
                {{ item.title }}
              </NuxtLink>
            </li>
          </ul>
          <div class="header-mobile__free-call">
            <FreeCall />
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import MenuIcon from '@/assets/images/icons/menu.svg'
import SearchIcon from '@/assets/images/icons/search.svg'
import ChevronRightIcon from '@/assets/images/icons/chevron-right.svg'
import HeadphonesIcon from '@/assets/images/icons/headphones.svg'
import AFIcon from '~/components/Blocks/AFIcon.vue'
import LogoText from '~/components/Blocks/LogoText.vue'
import topLinks from '@/enums/header/top-links'
import FreeCall from '~/components/Blocks/FreeCall.vue'
import InputWrapper from '~/components/Blocks/FormElements/InputWrapper.vue'
import bottomLinks from '@/enums/header/bottom-links'
import { computed, ref } from 'vue'
import ButtonIcon from '~/components/Blocks/ButtonIcon.vue'
import HeaderAuthBlock from '~/components/Blocks/Header/HeaderAuthBlock.vue'
import vClickAway from '@/directives/vClickAway'
import TextInput from '~/components/Blocks/FormElements/TextInput.vue'
import HeartIcon from '@/assets/images/icons/heart.svg'
import CartIcon from '@/assets/images/icons/cart.svg'

const { favoritesCount, cartCount } = storeToRefs(useProductCollectionsStore())
const route = useRoute()

const iconLinks = computed(() => [
  {
    icon: HeartIcon,
    to: { name: 'FavoritesPage' },
    badge: favoritesCount.value,
  },
  {
    icon: CartIcon,
    to: { name: 'CartPage' },
    badge: cartCount.value,
  },
])

const searchValue = ref('')

const bottomLinksMobile = computed(() =>
  bottomLinks.filter((item) => item.to.name !== 'HomePage')
)

const isMobileShown = ref(false)
const headerClassName = computed(() => {
  return {
    shown: isMobileShown.value,
  }
})

const mobileSearchShown = ref(false)
const mobileSearchClassName = computed(() => {
  return { shown: mobileSearchShown.value }
})

const headerMobileMenuBtnEl = ref<HTMLElement>()

watch(
  () => route.path,
  () => {
    isMobileShown.value = false
  }
)

function toggleMobileSearch() {
  mobileSearchShown.value = !mobileSearchShown.value
}
function toggleMenu() {
  isMobileShown.value = !isMobileShown.value
}
function closeMenu(e: Event) {
  if (headerMobileMenuBtnEl.value?.contains(e.target as HTMLElement)) return
  isMobileShown.value = false
}
</script>

<style lang="scss" scoped>
@use '/scss/mixins.scss';

.header {
  --header-height: 165px;
  z-index: 999;

  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.12);
  position: relative;
  background-color: var(--white);

  &__mobile {
    display: none;
  }

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__top {
    background-color: var(--primary-dark);
    padding: 5px 0;
  }
  &__top &__container {
    gap: 30px;
    color: var(--white);
  }

  &__top-logo {
    outline-color: var(--white);
  }

  &__top-links {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1.875rem;
    flex: 1 1 auto;

    a,
    button {
      outline-color: var(--white);
    }
  }

  &__main {
    border-bottom: 1px solid var(--stroke);
    padding: 1.5rem 0;
  }
  &__main &__container {
    gap: 60px;
  }

  &__main-icon-links {
    display: flex;
    align-items: center;
    gap: 33px;
  }

  &__search {
    min-width: 19rem;
  }

  &__bottom &__container {
    align-items: stretch;
  }

  &__bottom-catalog,
  &__auth {
    border-right: 1px solid var(--stroke);
    border-left: 1px solid var(--stroke);
    padding: 0.75rem 1rem;
  }

  &__bottom-catalog {
    min-width: 16.875rem;

    a {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      font: var(--text-18);
      font-weight: 500;
    }
  }

  &__auth {
    min-width: 16.875rem;
  }

  &__bottom-links {
    display: flex;
    gap: 2.5rem;
    justify-content: center;
    padding: 0.75rem 3rem;
    flex: 1 1 auto;
  }

  &__bottom-link {
    position: relative;
    display: inline-block;
    transition: var(--general-transition);

    &.--bold {
      font-weight: 700;
    }

    &::after {
      content: '';
      opacity: 0;
      bottom: 0;
      width: 100%;
      height: 0.625rem;
      transition: var(--general-transition);
    }

    &.active,
    &.router-link-exact-active {
      color: var(--secondary);

      &::after {
        opacity: 1;
      }
    }

    &:hover {
      color: var(--secondary);
    }
  }

  @include mixins.adaptive(tablet-big) {
    --header-height: 53px;
    --search-btn-size: 22px;

    box-shadow: none;
    background: transparent;

    &__mobile {
      display: block;
    }
    &__desktop {
      display: none;
    }

    &.shown .header-mobile {
      border-bottom-left-radius: 0;
    }
  }

  @include mixins.adaptive(desktop-small) {
    &__top-logo {
      :deep(.logo-text__logo) span:last-child {
        display: none;
      }
      :deep(.logo-text__text) {
        display: none;
      }
    }

    &__bottom-catalog {
      border-left: 0;
      padding-left: 0;
    }
    &__auth {
      padding-right: 0;
      border-right: 0;
    }
  }
}

.header-mobile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--white);
  border-radius: 0 0 9px 9px;
  padding: 15px;
  transition: var(--general-transition);

  &__search {
    height: 100%;
    position: absolute;
    left: 50px;
    right: auto;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    overflow: hidden;
    min-width: 2rem;
  }
  &__search.shown {
    right: 0;
  }

  &__search-button {
    position: relative;
    transform: translate(0.75rem, -0.25rem);
    z-index: 50;
    font-size: var(--search-btn-size);
    color: var(--primary-dark);
  }

  &__search-input-wrapper {
    position: absolute;
    z-index: 20;
    left: 0;
    right: 110%;
    background-color: var(--white);
    overflow: hidden;
    top: 50%;
    border: none;
    border-radius: 0;
    transform: translateY(-50%);
    transition: var(--general-transition);
  }
  &__search.shown &__search-input-wrapper {
    right: 15px;
  }
  &__search.shown + .header-mobile > .header-mobile {
    &__logo-wrapper,
    &__icons {
      opacity: 0;
    }
  }

  &__search-input {
    width: 100%;

    :deep(.input) {
      padding-left: calc(var(--search-btn-size) + 15px);
    }
  }

  &__menu-btn {
    font: var(--text-20);
    color: var(--primary-dark);
  }

  &__logo-wrapper,
  &__icons {
    transition: var(--general-transition);
  }

  &__logo {
    font: var(--text-18);
    font-weight: 700;
    color: var(--primary-dark);
  }

  &__icons {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  &__menu-wrapper {
    position: fixed;
    left: 0;
    top: var(--header-height);
    width: 100%;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 50;
    opacity: 0;
    transform: translateX(-100%);
    transition-property: opacity, transform;
    transition-duration: 0.3s, 0s;
    transition-delay: 0s, 0.3s;
  }
  .header.shown &__menu-wrapper {
    opacity: 1;
    transform: translateX(0);
    transition-delay: 0s;
  }

  &__menu {
    height: 100%;
    transform: translateX(-100%);
    max-width: 300px;
    background-color: var(--white);
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    transition: var(--general-transition);
  }
  .header.shown &__menu {
    transform: translateX(0);
  }

  &__menu-item {
    border-bottom: 1px solid #ededed;
    padding: 16px 22px;
  }

  &__menu-item-inner {
    font: var(--text-16);

    &.--iconed {
      display: flex;
      align-items: center;
      gap: 22px;
      font: var(--text-16);
      font-weight: 500;

      .icon {
        color: var(--primary);
        opacity: 0.3;
        width: 21px;
      }
    }
    &.--close {
      font: var(--text-18);
      font-weight: 700;

      .icon {
        opacity: 1;
      }
    }
  }

  &__auth-item {
    justify-content: flex-start;
  }

  &__free-call {
    padding: 15px;

    .btn-icon {
      display: none;
    }
  }
}
</style>
