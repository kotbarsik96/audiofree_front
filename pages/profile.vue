<template>
  <ProfilePage />
</template>

<script setup lang="ts">
import ProfilePage from '~/components/PageLayout.vue/ProfilePage.vue'

definePageMeta({
  auth: true,
  name: 'ProfilePage',
})
</script>
