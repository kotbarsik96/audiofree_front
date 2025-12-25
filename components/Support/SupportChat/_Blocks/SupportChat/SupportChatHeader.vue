<template>
  <div class="sc-header">
    <div class="name">{{ chatInfo?.user_name ?? '' }}</div>
    <div class="is-writing">
      <Transition name="drop-down">
        <div v-if="isCompanionWriting" class="iw-inner">
          <div>печатает</div>
          <SupportChatThreeDots />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import SupportChatThreeDots from '~/components/Support/SupportChat/_Blocks/SupportChat/SupportChatThreeDots.vue';
import type { ESupportChatSenderType } from '~/domain/support/chat/interfaces/ESupportChatSenderType'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'

const props = defineProps<{
  isCompanionWriting: boolean
  currentSenderType: ESupportChatSenderType
  chatInfo: ISupportChatInfo | undefined
}>()
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-header {
  padding-block: 0.5rem;
  padding-inline: 1rem;
  box-shadow: 9px 2px 9px rgba(0, 0, 0, 0.05);

  .name {
    font: var(--text-16);
    font-weight: 500;
  }

  .is-writing {
    min-height: 1.25rem;
    font: var(--text-16);
    color: var(--gray-700);

    .iw-inner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
}
</style>
