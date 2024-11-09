<template>
  <div class="layout">
    <AuthDialog v-model:shown="dialogShown" />
    <NotificationsContainer class="layout__notifications" />
    <ConfirmationDialogsList />
    <div class="layout__content">
      <PageHeader />
      <main class="layout__main" id="main">
        <slot></slot>
      </main>
      <PageFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/Layout/LayoutSections/PageHeader.vue'
import PageFooter from '~/components/Layout/LayoutSections/PageFooter.vue'
import NotificationsContainer from '~/components/Blocks/Notifications/NotificationsContainer.vue'
import AuthDialog from '~/components/Blocks/Dialog/AuthDialog.vue'
import ConfirmationDialogsList from '~/components/Blocks/ConfirmationDialogsList.vue'

const { dialogShown } = storeToRefs(useAuthStore())
</script>

<style lang="scss" scoped>
.layout {
  &__content {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__main {
    flex: 1 1 auto;
  }

  &:has(dialog[open]) &__notifications {
    display: none;
  }
}
</style>
