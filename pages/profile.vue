<template>
  <LogInToSeePage>
    <ProfilePage />
  </LogInToSeePage>
</template>

<script setup lang="ts">
import LogInToSeePage from '~/components/Auth/_Blocks/LogInToSeePage.vue'
import ProfilePage from '~/components/Profile/ProfilePage.vue'

definePageMeta({
  name: 'ProfilePage',
})
</script>
