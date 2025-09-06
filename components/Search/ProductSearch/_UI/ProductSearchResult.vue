<template>
  <li class="ps-result --no-padding" role="option">
    <NuxtLink class="link" :to="result.link">
      <AFImage class="img" :data="img" />
      <div class="title">{{ result.title }}</div>
      <div class="description">{{ result.description }}</div>
      <div v-if="matchString" class="match" v-html="matchString"></div>
    </NuxtLink>
  </li>
</template>

<script setup lang="ts">
import AFImage from '~/components/_UI/AFImage.vue'
import DOMPurify from 'dompurify'
import type { IProductSearchResult } from '~/domain/product_search/IProductSearchResult'
import SearchResultIconUrl from '~/assets/images/icons/search-result.svg?url'

const props = defineProps<{
  result: IProductSearchResult
}>()

const img = computed(() => {
  let _img = props.result.image
  if (!_img) _img = SearchResultIconUrl
  return _img
})

const matchString = computed(() => {
  if (!props.result.match) return null
  return DOMPurify.sanitize(props.result.match)
})
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.ps-result {
  padding: 0;

  .link {
    padding: var(--input-padding-y) var(--input-padding-x);
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: repeat(3, auto);
    column-gap: 1rem;
  }

  .img,
  .img :deep(img) {
    width: 50px;
    aspect-ratio: 1;
    grid-column: span 1;
    grid-row: 1 / -1;
    object-fit: contain;
  }

  .title {
    grid-column: span 1;
    grid-row: span 1;
    color: var(--gray-800);
    font: var(--text-14);
    font-weight: 600;
  }

  .description {
    grid-column: span 1;
    grid-row: span 1;
    color: var(--gray-600);
    font: var(--text-14);
    font-weight: 600;
  }

  .match {
    grid-column: span 1;
    grid-row: span 1;
    color: var(--gray-400);
    font: var(--text-14);
    font-weight: 500;

    :deep(span) {
      background-color: var(--status-3);
      color: var(--white);
    }
  }
}
</style>
