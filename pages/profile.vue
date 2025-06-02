<template>
  <LogInToSeePage>
    <ProfilePage />
  </LogInToSeePage>
</template>

<script setup lang="ts">
import LogInToSeePage from '~/components/Blocks/LogInToSeePage.vue'
import ProfilePage from '~/components/PageLayout/ProfilePage.vue'

definePageMeta({
  name: 'ProfilePage',
})
</script>
