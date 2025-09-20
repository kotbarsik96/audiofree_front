<template>
  <div class="sc-supporter">
    <div class="_container">
      <div class="wrap _section-box">
        <SupportChatSupporter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SupportChatSupporter from '~/components/Support/_UI/SupportChat/SupportChatSupporter.vue'
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-supporter {
  padding-block: 5rem;
}
</style>
