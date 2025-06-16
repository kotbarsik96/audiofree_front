<template>
  <ul class="cf-checkboxes">
    <li v-for="item in values" class="cf-option">
      <AFCheckbox
        v-if="type === 'checkbox'"
        :value="item.value_slug"
        :label="item.value"
        v-model="state"
        @change="updateLastChangedFilter"
      />
      <AFCheckbox
        v-if="type === 'checkbox_boolean'"
        :label="item.value"
        v-model="state"
        @change="updateLastChangedFilter"
      />
    </li>
    <li v-if="lastChangedFilter === slug">
      <CFilterApplyButton @apply="apply" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useRouteQuery } from '@vueuse/router'
import CFilterApplyButton from '~/components/Blocks/CatalogFilter/CFilterApplyButton.vue'
import AFCheckbox from '~/components/Blocks/FormElements/AFCheckbox.vue'
import type {
  ICheckboxBooleanItem,
  IFilterOption,
} from '~/domain/product/types/IFilterItem'

const props = defineProps<{
  section: IFilterOption | ICheckboxBooleanItem
  lastChangedFilter: string
}>()

const emit = defineEmits<{
  (e: 'apply'): void
  (e: 'update:lastChangedFilter', value: string): void
}>()

defineExpose({
  reset,
})

const slug = computed(() => props.section.slug)
const type = computed(() => props.section.type)
const values = computed(() => props.section.values)

let state: Ref<any>
if (type.value === 'checkbox') {
  state = useRouteQuery(slug.value, [], {
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
}
if (type.value === 'checkbox_boolean') {
  state = useRouteQuery<any>(slug.value, null, {
    transform: {
      get(value) {
        if (value === 'false' || !value) return null
        return true
      },
      set(value) {
        if (!value) return null
        return value
      },
    },
  })
}

function reset() {
  if (type.value === 'checkbox') state.value = []
  if (type.value === 'checkbox_boolean') state.value = null
}
function apply() {
  emit('apply')
}
function updateLastChangedFilter() {
  emit('update:lastChangedFilter', slug.value)
}
</script>

<style lang="scss" scoped>
.cf-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
