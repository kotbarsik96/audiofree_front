<template>
  <div class="sc-date" :class="classes" ref="element">
    <time class="inner" :datetime="dateFormatted">
      {{ dateFormatted }}
    </time>
  </div>
</template>

<script setup lang="ts">
import { getChatBodyElement } from '~/domain/support/chat/utils'

const props = defineProps<{
  date: string
}>()

const element = useTemplateRef<HTMLTimeElement>('element')

const sticky = ref(false)
const hidden = ref(false)

const dateFormatted = computed(() =>
  new Date(props.date).toLocaleDateString('ru-RU', {
    year: undefined,
    month: 'long',
    day: 'numeric',
  })
)

const classes = computed(() => ({
  '--hidden': hidden.value,
  '--sticky': sticky.value,
}))

let intersectionObserver: IntersectionObserver

onMounted(() => {
  if (element.value) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(0)
        if (!entry) {
          sticky.value = false
          return
        }

        const entryRootTop = entry.rootBounds?.top ?? 0
        const diff = entryRootTop - entry.boundingClientRect.top

        const notSticky =
          (entry.intersectionRatio === 0 && !entry.isIntersecting) ||
          diff < 0 ||
          diff > 10 + (element.value?.offsetHeight ?? 0)
        sticky.value = !notSticky

        sticky.value ? addScrollHandler() : removeScrollHandler()
      },
      {
        root: getChatBodyElement(element.value),
        rootMargin: '-1px 0px 0px 0px',
        threshold: [0, 1],
      }
    )
    intersectionObserver.observe(element.value)

    onScroll()
  }
})

onUnmounted(() => {
  if (intersectionObserver) intersectionObserver.disconnect()
  removeScrollHandler()
})

let setHiddenTimeout: ReturnType<typeof setTimeout>

const onScroll = debounce(() => {
  hidden.value = false
  if (setHiddenTimeout) clearTimeout(setHiddenTimeout)
  setHiddenTimeout = setTimeout(() => {
    hidden.value = true
  }, 1000)
}, 100)

function addScrollHandler() {
  getChatBodyElement(element.value)?.addEventListener('scroll', onScroll)
}
function removeScrollHandler() {
  getChatBodyElement(element.value)?.removeEventListener('scroll', onScroll)
  if (setHiddenTimeout) clearTimeout(setHiddenTimeout)
  hidden.value = false
}
</script>

<style lang="scss" scoped>
@use '/css/mixins/mixins.scss';

.sc-date {
  position: sticky;
  top: 0px;
  padding-block-start: 0.5rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--general-transition);

  .inner {
    background-color: var(--gray-100);
    color: var(--gray-800);
    font: var(--text-16);
    text-align: center;
    border-radius: var(--sc-date-border-radius);
    padding: 0.25rem 0.5rem;
    font-weight: 500;
  }

  &.--hidden.--sticky {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
