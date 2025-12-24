import type { Directive } from 'vue'

export const vAutofocus: Directive = {
  mounted(el: any) {
    if ('focus' in el && typeof el.focus === 'function') {
      el.focus()
    }
  },
}
