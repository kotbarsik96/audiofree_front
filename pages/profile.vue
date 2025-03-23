<template>
  <ProfilePage />
</template>

<script setup lang="ts">
import ProfilePage from '~/components/PageLayout/ProfilePage.vue'

definePageMeta({
  auth: true,
  name: 'ProfilePage',
})
</script>
