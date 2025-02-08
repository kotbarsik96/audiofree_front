<template>
  <div class="cf-range">
    <div class="cf-range__inputs">
      <NumberInput
        class="cf-range__input"
        :min="min"
        :maxFractionDigits="2"
        :max="stateMax"
        v-model="stateMin"
        lazy
      />
      <div class="cf-range__inputs-delimeter">–</div>
      <NumberInput
        class="cf-range__input"
        :min="stateMin"
        :maxFractionDigits="2"
        :max="max"
        v-model="stateMax"
        lazy
      />
    </div>
    <div class="cf-range__range">
      <InputRangeDouble
        v-model:valueMin="stateMin"
        v-model:valueMax="stateMax"
        :min="min"
        :max="max"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import NumberInput from '~/components/Blocks/FormElements/NumberInput.vue'
import InputRangeDouble from '~/components/Blocks/InputRangeDouble.vue'

const props = defineProps<{
  slug: string
  min: number
  max: number
  isDependant?: boolean
}>()

defineExpose({
  reset,
  isDependant: props.isDependant,
})

const stateMin = useRouteQuery(`min_${props.slug}`, Math.floor(props.min), {
  transform: {
    get(val) {
      if (typeof val === 'string') val = Number(val)
      return val
    },
    set(val) {
      if (typeof val === 'string') val = Number(val)
      if (val < props.min) val = props.min
      if (val > stateMax.value) val = stateMax.value
      return val
    },
  },
})
const stateMax = useRouteQuery(`max_${props.slug}`, Math.floor(props.max), {
  transform: {
    get(val) {
      if (typeof val === 'string') val = Number(val)
      return val
    },
    set(val) {
      if (typeof val === 'string') val = Number(val)
      if (val < stateMin.value) val = stateMin.value
      if (val > props.max) val = props.max
      return val
    },
  },
})

if (stateMin.value > stateMax.value) stateMin.value = props.min

watch(() => [props.min, props.max], onFilterValuesUpdate)

function onFilterValuesUpdate() {
  if (stateMin.value < props.min) stateMin.value = props.min
  if (stateMax.value > props.max) stateMax.value = props.max
}

async function reset() {
  console.log('resetting range');
  stateMin.value = props.min
  stateMax.value = props.max
  await nextTick()
}
</script>

<style lang="scss" scoped>
.cf-range {
  &__inputs {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin-bottom: 2rem;
  }

  &__input {
    max-width: 6.25rem;
  }

  &__inputs-delimeter {
    color: var(--black);
    @include fontSize(16);
  }

  &__range {
    width: 100%;
  }
}
</style>
