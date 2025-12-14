<template>
  <SupportChatsListPage />
</template>

<script setup lang="ts">
import SupportChatsListPage from '~/components/Support/SupportChatStaff/SupportChatsPage.vue'

definePageMeta({
  name: "SupportChatsListPage"
})
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
</style>
