import type { ShallowRef } from 'vue'

export function useSupportChatBottomButton(
  chatBodyElement: Readonly<ShallowRef<HTMLElement | null>>
) {
  const isBtnVisible = ref(false)

  const { fn: onChatBodyScroll } = debounce(() => {
    if (chatBodyElement.value) {
      const chatBodyHeight = chatBodyElement.value.offsetHeight
      const pos = chatBodyElement.value.scrollTop + chatBodyHeight
      isBtnVisible.value = pos <= chatBodyElement.value.scrollHeight - 50
    }
  }, 100)

  const onChatBottomBtnClick = () => {
    isBtnVisible.value = false
    chatBodyElement.value?.scrollTo({
      top: chatBodyElement.value.scrollHeight,
      behavior: 'smooth',
    })
  }

  return {
    isBtnVisible,
    onChatBodyScroll,
    onChatBottomBtnClick,
  }
}
