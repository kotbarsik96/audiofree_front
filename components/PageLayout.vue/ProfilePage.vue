<template>
  <div class="profile _page">
    <div class="_container profile__container">
      <ProfileEmail />
      <ProfileUserInfo />
      <ProfilePassword />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileUserInfo from '~/components/Page/ProfilePage/ProfileUserInfo.vue'
import ProfilePassword from '~/components/Page/ProfilePage/ProfilePassword.vue'
import ProfileEmail from '~/components/Page/ProfilePage/ProfileEmail.vue'
</script>

<style lang="scss">
.profile {
  margin-bottom: 2rem;

  &__container {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
}
</style>
