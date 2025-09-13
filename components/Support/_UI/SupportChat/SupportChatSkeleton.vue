<template>
  <div class="sc-skeleton">
    <div v-for="item in 3" class="skeleton-group">
      <div class="sg-date"></div>
      <div class="sg-messages">
        <div v-for="sgm in item" class="sg-message"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.chat-skeleton {
  .skeleton-group {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    padding-block-start: 1rem;
  }

  .sg-date {
    align-self: center;
    width: 6.5rem;
    height: 1.25rem;
    border-radius: 8px;
    background-color: var(--gray-400);
  }

  .sg-messages {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .sg-message {
    border-radius: 8px;
    width: 25rem;
    height: 9.5rem;
    background-color: var(--gray-400);
  }
}
</style>
