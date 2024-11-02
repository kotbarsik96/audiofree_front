<template>
  <div class="product-info">
    <AFTabs v-model="tabId">
      <AFTab title="Tab 1 title" tabId="tab1" :currId="tabId">Tab 1 content</AFTab>
      <AFTab title="Tab 2 title" tabId="tab2" :currId="tabId">Tab 2 content</AFTab>
    </AFTabs>
  </div>
</template>

<script setup lang="ts">
import AFTabs from '~/components/Blocks/Tabs/AFTabs.vue'
import AFTab from '~/components/Blocks/Tabs/AFTab.vue'

const tabId = ref('tab1')
</script>

<style lang="scss" scoped></style>
