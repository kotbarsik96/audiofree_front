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
import NumberInput from '~/components/Blocks/FormElements/NumberInput.vue'
import InputRangeDouble from '~/components/Blocks/InputRangeDouble.vue'

const props = defineProps<{
  slug: string
  min: number
  max: number
  valueMin: number
  valueMax: number
}>()

const emit = defineEmits<{
  (e: 'update:valueMin', value: number): void
  (e: 'update:valueMax', value: number): void
}>()

const stateMin = computed({
  get() {
    return props.valueMin
  },
  set(v) {
    emit('update:valueMin', v)
  },
})
const stateMax = computed({
  get() {
    return props.valueMax
  },
  set(v) {
    emit('update:valueMax', v)
  },
})
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
