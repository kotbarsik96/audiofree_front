<template>
  <div class="notifications-container">
    <ClientOnly>
      <TransitionGroup name="notification-anim">
        <NotificationItem
          v-for="item in notifications"
          :key="item.id"
          :data="item"
        />
      </TransitionGroup>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import NotificationItem from '~/components/_UI/Notifications/NotificationItem.vue'
import { useNotifications } from '@/composables/useNotifications'

const { getNotificationsList } = useNotifications()

const notifications = getNotificationsList()
</script>

<style lang="scss" scoped>
.notifications-container {
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 400px;
  max-width: 90%;
  z-index: 9999;
}
</style>
