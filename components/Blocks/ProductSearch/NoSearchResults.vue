<template>
  <div class="no-results">
    <SearchIcon class="nr-icon" />
    <div class="nr-text">
      Не найдено результатов по запросу
      <span>{{ searchValue }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchIcon from '~/assets/images/icons/search-result.svg'

const props = defineProps<{
  searchValue: string
}>()
</script>

<style lang="scss" scoped>
@use '/scss/mixins.scss';

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1rem;

  .nr-icon {
    width: 25px;
    aspect-ratio: 1;
    color: var(--gray-800);
  }

  .nr-text {
    color: var(--gray-600);
    font-weight: 500;
    text-align: center;

    span {
      font-weight: 600;
      color: var(--gray-800);
    }
  }
}
</style>
