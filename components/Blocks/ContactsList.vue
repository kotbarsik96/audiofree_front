<template>
  <ul class="contacts-list">
    <li class="contacts-list__contact-item">
      <FreeCall />
    </li>
    <li
      v-for="item in contacts"
      :key="item.title"
      class="contacts-list__contact-item"
    >
      <ButtonIcon :icon="item.icon" type="div" />
      <div>
        <div class="contacts-list__contact-item-title">{{ item.title }}</div>
        <div class="contacts-list__contact-item-detail">{{ item.detail }}</div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import contacts from '@/enums/footer/contacts'
import FreeCall from '~/components/Blocks/FreeCall.vue'
import ButtonIcon from '~/components/Blocks/ButtonIcon.vue'
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 15px;

  &__contact-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;

    :deep(.btn-icon) {
      background-color: var(--secondary);
    }
    :deep(.btn-icon:not(div)):hover {
      background-color: var(--secondary-2);
    }
  }

  &__contact-item-title {
    font: var(--text-16);
  }

  &__contact-item-detail {
    font: var(--text-16);
    font-weight: 700;
  }

  @include mixins.adaptive(tablet-big) {
    &__contact-item {
      :deep(.btn-icon) {
        width: 2rem;
        height: 2rem;

        svg {
          width: 1.25rem;
          height: 1.25rem;
        }
      }
    }
  }
}
</style>
