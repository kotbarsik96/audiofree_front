<template>
  <div class="fav-sorts">
    
  </div>
</template>

<script setup lang="ts">
import AFSelect from '~/components/Blocks/AFSelect.vue'
import { useSorts } from "~/domain/product/useSorts";
import type ISelectOption from "~/interfaces/components/ISelectOption";

const props = defineProps<{
  
}>()

const { data: sortData } = await useAPI<{ data: ISelectOption[] }>(
  '/product/favorites/sorts'
)

const { options, orderOptions, sort, sortOrder } = useSorts(sortData)
</script>

<style lang="scss" scoped>
  
</style>