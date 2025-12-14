<template>
  <div class="sc-staff">
    <div class="top-spy" ref="topSpyElement"></div>
    <div class="bottom-spy" ref="bottomSpyElement"></div>
  </div>
</template>

<script setup lang="ts">
const topSpyElement = useTemplateRef<HTMLElement>('topSpyElement')
const bottomSpyElement = useTemplateRef<HTMLElement>('bottomSpyElement')

const route = useRoute()

const chatId = computed(() => Number(route.params.id ?? 0))

const { messages } = await useSupportChat(
  topSpyElement,
  bottomSpyElement,
  chatId
)

console.log(messages);
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
</style>
