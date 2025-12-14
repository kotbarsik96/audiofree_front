<template>
  <div class="sc-list">
    <SupportChatStaffLink v-for="chat in list" :key="chat.id" :chat="chat" />
    <div class="spy" ref="spyElement"></div>
  </div>
</template>

<script setup lang="ts">
import SupportChatStaffLink from '~/components/Support/SupportChatStaff/_Blocks/SupportChatStaffLink.vue'
import type { ISupportChatListItem } from '~/domain/support/chat/interfaces/ISupportChatListItem'

const spyElement = useTemplateRef<HTMLElement>('spyElement')

const route = useRoute()

const per_page = 10

const page = computed(() => Number(route.query.page ?? '1'))

const search = ref('')

const { list, error, reset } =
  await usePaginationLazyWrapper<ISupportChatListItem>(
    spyElement,
    '/support-chat/list',
    {
      credentials: 'include',
      watch: false,
      query: {
        search,
        page,
        per_page,
      },
    }
  )

if (error.value) {
  throw createError(error.value)
}

const refetch = debounce(reset, 500)

watch(search, refetch)
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-list {
  overflow: auto;
}
</style>
