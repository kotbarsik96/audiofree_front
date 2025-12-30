<template>
  <div class="sc-skeleton">
    <div class="date"></div>
    <div class="messages">
      <div class="message" style="height: 6.7rem"></div>
      <div class="message" style="width: 35%"></div>
      <div class="message --right" style="width: 35%"></div>
      <div class="message --right" style="height: 6.7rem"></div>
      <div class="message" style="width: 35%"></div>
      <div class="message --right" style="width: 35%"></div>
      <div class="message" style="width: 35%"></div>
    </div>
    <div class="date"></div>
    <div class="messages">
      <div class="message --right" style="width: 35%"></div>
      <div class="message --right" style="width: 40%"></div>
      <div class="message" style="width: 35%"></div>
      <div class="message" style="width: 25%"></div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-skeleton {
  .date {
    border-radius: var(--sc-date-border-radius);
    margin-block: var(--sc-dated-group-gap);
    margin-inline: auto;
    background-color: var(--gray-400);
    width: 6.2rem;
    height: 2rem;
  }

  .messages {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--sc-list-gap);
  }

  .message {
    --msg-multiplier: 1;

    border-radius: var(--sc-message-border-radius);
    max-width: 100%;
    width: var(--sc-list-width);
    height: 5.5rem;
    background-color: var(--gray-400);

    &.--right {
      align-self: flex-end;
    }
  }
}
</style>
