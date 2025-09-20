<template>
  <div class="sc-list">
    <SupportChatsList />
  </div>
</template>

<script setup lang="ts">
import SupportChatsList from '~/components/Support/_UI/SupportChatList/SupportChatsList.vue'
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-list {
  padding-block: 5rem;
}
</style>
