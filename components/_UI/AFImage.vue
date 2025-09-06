<template>
  <picture class="image" :class="{ '--visible': isVisible }" ref="el">
    <img :src="_src" :alt="alt" />
  </picture>
</template>

<script setup lang="ts">
import { useSwiperSlide } from 'swiper/vue'
import type IImage from '~/domain/images/types/IImage'

const props = withDefaults(
  defineProps<{
    data: IImage | string
    alt?: string
    loadImmediately?: boolean
  }>(),
  {
    alt: '',
  }
)

const el = ref<HTMLPictureElement>()

const isInWindow = ref(props.loadImmediately)
let observer: IntersectionObserver

const swiperInjection = inject('swiperSlide', null)
const swiperData = swiperInjection ? useSwiperSlide() : null
const isSlideVisible = computed(
  () =>
    !swiperData?.value ||
    swiperData?.value.isVisible ||
    swiperData?.value.isPrev ||
    swiperData?.value.isNext
)

const isVisible = computed(
  () => props.loadImmediately || (isSlideVisible.value && isInWindow.value)
)
const _src = computed(() => {
  let src = '#'
  if (isVisible.value) {
    if (typeof props.data === 'string') src = props.data
    else src = props.data.url
  }
  return src
})

watch(isVisible, () => {
  if (isVisible.value && observer) unsetObserver()
})

onMounted(() => {
  if (!props.loadImmediately) setObserver()
})
onUnmounted(() => {
  unsetObserver()
})

function setObserver() {
  if (!observer && el.value) {
    observer = new IntersectionObserver(onIntersection, {
      rootMargin: '0px 0px 100px 0px',
      threshold: 0,
    })
    observer.observe(el.value)
  }
}
function unsetObserver() {
  if (observer) observer.disconnect()
}

function onIntersection(entries: IntersectionObserverEntry[]) {
  isInWindow.value = entries.some((entry) => entry.isIntersecting)
}
</script>

<style lang="scss" scoped>
.image {
  img {
    filter: blur(10px);
    transition: all 0.25s ease-in-out;
  }

  &.--visible {
    img {
      filter: blur(0px);
    }
  }
}
</style>
