<template>
  <div class="info-subsection" :class="{ '--shown': shown }">
    <button
      v-if="hideable"
      class="info-s-name"
      type="button"
      aria-label="Скрыть/раскрыть опции"
      @click="toggleOptions"
    >
      <span>{{ subsection.name }} ({{ subsection.values.length }})</span>
      <ChevronRight />
    </button>
    <div v-else class="info-s-name">
      {{ subsection.name }}
      ({{ subsection.values.length }})
    </div>
    <ul
      class="info-s-options"
      :class="{ '_hideable-element': hideable, '--shown-element': shown }"
    >
      <li v-for="option in subsection.values">
        <AFCheckbox
          :value="option"
          :label="option"
          v-model="state"
          @change="onChange"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import ChevronRight from '~/assets/images/icons/chevron-right.svg'
import AFCheckbox from '~/components/_UI/FormElements/AFCheckbox.vue'
import type { IFilterInfoItemSubsection } from '~/domain/product/types/IFilterItem'

const props = defineProps<{
  subsection: IFilterInfoItemSubsection
}>()

const emit = defineEmits<{
  (e: 'change'): void
}>()

defineExpose({ reset })

const shown = ref(false)

// const hideable = computed(() => props.subsection.values.length > 3)
const hideable = computed(() => true)

const state = useRouteQuery(props.subsection.slug, [], {
  transform: {
    get(val) {
      if (typeof val === 'string') return [val]
      if (!val) return []
      return val
    },
    set(val) {
      if (typeof val === 'string') return [val]
      if (!val) return []
      return val
    },
  },
})

function toggleOptions() {
  shown.value = !shown.value
}

function onChange() {
  emit('change')
}

function reset() {
  state.value = []
}
</script>

<style lang="scss" scoped>
.info-subsection {
  .info-s-name {
    font: var(--text-16);
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    width: 100%;
    text-align: left;

    svg {
      width: 1.25rem;
      aspect-ratio: 1px;
      transform: rotate(90deg);
      transition: var(--general-transition);
    }
  }

  .info-s-options {
    margin-block-start: 0.5rem;

    &._hideable-element:not(.--shown-element) {
      display: none;
    }

    li {
      &:not(:last-child) {
        margin-block-end: 0.625rem;
      }
    }
  }

  &.--shown {
    .info-s-name {
      svg {
        transform: rotate(-90deg);
      }
    }
  }
}
</style>
