<template>
  <Transition name="blur-relative">
    <div v-if="shown" class="empty-list">
      <component :is="iconComponent" class="empty-list__icon"></component>
      <div class="empty-list__text">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  icon?: 'empty-box' | 'empty-chat' | any
  shown?: boolean
}>()

const iconComponent = computed(() => {
  if (!props.icon) return null
  else if (typeof props.icon === 'string') {
    return defineAsyncComponent(
      () => import(`~/assets/images/icons/${props.icon}.svg`)
    )
  } else return props.icon
})
</script>

<style lang="scss" scoped>
.empty-list {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  font: var(--text-18);
  font-weight: 500;

  &__icon {
    width: 5rem;
    height: 5rem;
    margin-bottom: 0.625rem;
  }
}
</style>
