<template>
  <div class="catalog _page">
    <div class="_container">
      <div class="catalog__inner">
        <aside class="catalog__sidebar">
          <CatalogFilter />
          <!-- карточка ads -->
        </aside>
        <div class="catalog__main">
          <div class="catalog__main-header">
            <div class="_page-header">
              <BreadCrumbs />
              <h1 class="_page-header__title">Каталог</h1>
            </div>
            <AFSelect
              :options="options"
              v-model="sortType"
              v-model:shown="selectShown"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CatalogFilter from '~/components/Blocks/CatalogFilter.vue'
import BreadCrumbs from '~/components/Blocks/BreadCrumbs.vue'
import AFSelect from '~/components/Blocks/AFSelect.vue'
import ChevronRightIcon from '~/assets/images/icons/chevron-right.svg'

const options = [
  {
    label: 'По цене (по возрастанию)',
    icon: ChevronRightIcon,
    value: 'price_asc',
    iconRotate: '-90deg',
  },
  {
    label: 'По цене (по убыванию)',
    icon: ChevronRightIcon,
    value: 'price_desc',
    iconRotate: '90deg',
  },
  {
    label: 'По популярности (по убыванию)',
    value: 'popular_desc',
    icon: ChevronRightIcon,
    iconRotate: '-90deg',
  },
  {
    label: 'По популярности (по возрастанию)',
    value: 'popular_asc',
    icon: ChevronRightIcon,
    iconRotate: '90deg',
  },
]
const sortType = ref(options[0].value)

const selectShown = ref(false)
</script>

<style lang="scss" scoped></style>
