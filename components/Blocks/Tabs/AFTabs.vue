<template>
  <div class="tabs">
    <div class="tabs__titles">
      <button
        v-for="item in data"
        :key="item.tabId"
        @click="setTabId(item.tabId)"
      >
        {{ item.title }}
      </button>
    </div>
    <div class="tabs__body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', tabId: typeof props.modelValue): void
}>()

const slots = useSlots()

const childComponents = computed(() => slots.default?.() || [])

const data = computed<
  {
    title: string
    tabId: string
  }[]
>(() =>
  childComponents.value.map((component) => {
    return {
      title: component.props?.title,
      tabId: component.props?.tabId,
    }
  })
)

const _tabId = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emit('update:modelValue', v)
  },
})

function setTabId(tabId: string) {
  _tabId.value = tabId
}
</script>

<style lang="scss" scoped></style>
