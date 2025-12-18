<template>
  <time class="sc-date" :datetime="dateFormatted">{{ dateFormatted }}</time>
</template>

<script setup lang="ts">
const props = defineProps<{
  date: string
}>()

const dateFormatted = computed(() =>
  new Date(props.date).toLocaleDateString('ru-RU', {
    year: undefined,
    month: 'long',
    day: 'numeric',
  })
)
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-date {
  position: sticky;
  top: 0;
  background-color: var(--gray-100);
  color: var(--gray-800);
  font: var(--text-16);
  text-align: center;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-weight: 500;
}
</style>
