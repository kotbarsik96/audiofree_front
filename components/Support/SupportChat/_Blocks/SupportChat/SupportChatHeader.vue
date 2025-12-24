<template>
  <div class="sc-header">
    <div class="name">{{ chatInfo?.user_name ?? '' }}</div>
    <div class="is-writing">
      <Transition name="drop-down">
        <div v-if="isCompanionWriting" class="iw-inner">
          <div>печатает</div>
          <div class="dots">
            <span style="--i: 0"></span>
            <span style="--i: 1"></span>
            <span style="--i: 2"></span>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
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

    .dots {
      display: flex;
      align-items: center;
      gap: 0.25rem;

      span {
        --duration: 1.5s;

        display: inline-block;
        width: 0.5rem;
        height: auto;
        aspect-ratio: 1;
        border-radius: 50%;
        background: var(--primary);
        animation-name: dotAnimation;
        animation-timing-function: ease-in-out;
        animation-duration: var(--duration);
        animation-delay: calc(var(--i) * var(--duration) * 0.1);
        animation-iteration-count: infinite;
        opacity: 0.75;
      }
    }
  }
}

@keyframes dotAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
