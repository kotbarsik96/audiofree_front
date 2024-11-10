<template>
  <div class="profile _page">
    <div class="_container profile__container">
      <ProfileUserInfo />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileUserInfo from '~/components/Page/ProfilePage/ProfileUserInfo.vue'
</script>

<style lang="scss">
.profile{ 
  margin-bottom: 2rem;

  &__container {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
}
</style>
