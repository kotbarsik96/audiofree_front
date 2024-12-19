<template>
  <div class="profile _page">
    <div class="_container profile__container">
      <BreadCrumbs />
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
import BreadCrumbs from '~/components/Blocks/BreadCrumbs.vue'

const { setBreadcrumbs } = useBreadcrumbs()
setBreadcrumbs([
  {
    index: 2,
    label: 'Профиль',
    link: { name: 'ProfilePage' },
  },
])
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
