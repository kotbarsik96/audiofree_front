import type { RouterConfig } from 'nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (
      to.name === 'SupportChatStaffPage' &&
      from.name === 'SupportChatStaffPage'
    )
      return undefined

    return savedPosition ?? { top: 0 }
  },
}
