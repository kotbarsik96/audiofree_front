import type { Directive } from 'vue'

const listeners = new Map<
  HTMLElement,
  { onKeydown: (event: KeyboardEvent) => void }
>()

export type TArrowNavigationOptions = {
  focusableTag: 'a' | 'li'
}

export const vArrowNavigation: Directive = {
  mounted(el: any, bindings: { value?: TArrowNavigationOptions }) {
    const focusableTag = bindings.value?.focusableTag || 'a'

    listeners.set(el, { onKeydown })
    el.addEventListener('keydown', onKeydown)

    function onKeydown(event: KeyboardEvent) {
      const key = event.key.toLowerCase()
      if (['arrowdown', 'arrowup'].includes(key)) {
        event.preventDefault()
        const activeElement = document.activeElement
        if (!el.contains(activeElement)) return

        const links = Array.from(
          (el as HTMLElement).querySelectorAll(focusableTag)
        )
        let jumpToLink: HTMLElement | null = null

        if (activeElement?.tagName.toLowerCase() === focusableTag) {
          const currentIndex = links.findIndex((link) => link === activeElement)
          if (currentIndex >= 0) {
            switch (key) {
              case 'arrowdown':
                if (currentIndex + 1 < links.length)
                  jumpToLink = links[currentIndex + 1]
                break
              case 'arrowup':
                if (currentIndex - 1 >= 0) jumpToLink = links[currentIndex - 1]
                break
            }
          }
        } else {
          jumpToLink = (el as HTMLElement).querySelector(focusableTag)
        }

        if (!jumpToLink) {
          const input = el.querySelector('input, textarea')
          if (input) jumpToLink = input ?? el
        }
        jumpToLink?.focus()
      }
    }
  },
  unmounted(el: any) {
    const data = listeners.get(el)
    el.removeEventListener('keydown', data?.onKeydown)
  },
}
