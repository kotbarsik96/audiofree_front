<template>
  <div class="rating" :style="style">
    <div class="rating__items rating__items--totals">
      <AFIcon
        v-for="num in total"
        class="rating__icon"
        :icon="_icon"
        :key="num"
      />
    </div>
    <div class="rating__items rating__items--values">
      <AFIcon
        v-for="num in total"
        class="rating__icon"
        :icon="_icon"
        :key="num"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AFIcon from '~/components/Blocks/AFIcon.vue'
import StarIcon from '~/assets/images/icons/star.svg'

const props = withDefaults(
  defineProps<{
    icon?: string | any
    total?: number
    value: number
  }>(),
  {
    total: 5,
  }
)

const valuePercent = computed(() => props.value / (props.total / 100))
const style = computed(() => ({
  '--percent': `${valuePercent.value}%`,
}))

const _icon = computed(() => props.icon || StarIcon)
</script>

<style lang="scss" scoped>
.rating {
  position: relative;

  &__items {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  &__items--totals {
    position: relative;
    z-index: 1;
  }
  &__items--totals &__icon {
    color: var(--rating-total-color);
  }

  &__icon {
    width: 0.75rem;
    height: 0.75rem;
    flex-shrink: 0;
  }

  &__items--values {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 5;
    width: var(--percent);
    overflow: hidden;
  }
  &__items--values &__icon {
    color: var(--rating-fill-color);
  }
}
</style>
