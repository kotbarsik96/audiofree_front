import { useSupportChatStaffStore } from '~/stores/supportChat/supportChatStaffStore'
import { useSupportChatUserStore } from '~/stores/supportChat/supportChatUserStore'

export function useSupportChatStore(chat_id: MaybeRefOrGetter<number> | undefined) {
  const store = chat_id ? useSupportChatStaffStore() : useSupportChatUserStore()

  return store
}
