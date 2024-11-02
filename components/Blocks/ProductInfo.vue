<template>
  <div class="product-info">
    <table class="product-info__table">
      <tbody>
        <tr v-for="item in info">
          <td>
            {{ item.name }}
          </td>
          <td>
            {{ item.value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { IProductInfo } from '~/domain/product/types/IProductData'

const props = defineProps<{
  info: IProductInfo[]
}>()
</script>

<style lang="scss" scoped>
.product-info {
  --cell-border-radius: 9px;

  width: 100%;

  &__table {
    border-collapse: collapse;
    width: 100%;

    tr:nth-child(odd) {
      td {
        background-color: var(--info-row-bg);
      }
    }

    td {
      padding: 10px 25px;

      &:first-child {
        border-top-left-radius: var(--cell-border-radius);
        border-bottom-left-radius: var(--cell-border-radius);
      }
      &:last-child {
        border-top-right-radius: var(--cell-border-radius);
        border-bottom-right-radius: var(--cell-border-radius);
      }
    }
  }
}
</style>
