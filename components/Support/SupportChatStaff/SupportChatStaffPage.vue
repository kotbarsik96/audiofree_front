<template>
  <div class="sc-staff">
    
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const chat_id = computed(() => route.params.id)

const [
  { data: chatInfoData, error: chatInfoError },
  { data: messagesData, error: messagesError },
] = await Promise.all([
  useAPI('/support-chat/', {
    credentials: 'include',
    query: {
      chat_id,
    },
  }),
  useAPI('/support-chat/messages', {
    credentials: 'include',
    query: {
      chat_id,
    },
  }),
])

if (chatInfoError.value) {
  throw createError(chatInfoError.value)
}
if (messagesError.value) {
  throw createError(messagesError.value)
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';
</style>
