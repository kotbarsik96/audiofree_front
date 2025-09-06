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
import ProfileUserInfo from '~/components/Profile/_Blocks/ProfileUserInfo.vue'
import ProfilePassword from '~/components/Profile/_Blocks/ProfilePassword.vue'
import ProfileEmail from '~/components/Profile/_Blocks/ProfileEmail.vue'
import BreadCrumbs from '~/components/_UI/BreadCrumbs.vue'

const { setBreadcrumbs } = useBreadcrumbs()
setBreadcrumbs([
  {
    index: 2,
    label: 'Профиль',
    link: { name: 'ProfilePage' },
  },
])

const { data } = await useAPI<{ data: IPageSeo }>('page/profile')
usePageMeta(data)
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
