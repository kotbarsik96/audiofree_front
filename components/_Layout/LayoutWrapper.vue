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
import PageHeader from '~/components/_Layout/LayoutSections/PageHeader.vue'
import PageFooter from '~/components/_Layout/LayoutSections/PageFooter.vue'
import NotificationsContainer from '~/components/_UI/Notifications/NotificationsContainer.vue'
import AuthDialog from '~/components/_UI/Dialog/AuthDialog.vue'
import ConfirmationDialogsList from '~/components/_UI/Confirmation/ConfirmationDialogsList.vue'

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
