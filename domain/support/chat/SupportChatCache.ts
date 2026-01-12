import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'

export type TCacheChatKey = number | 'user'

class SupportChatCache {
  private max = 4

  private cachedChats = new Map<
    TCacheChatKey,
    { messages: ISupportChatMessage[] }
  >()

  storeChat(key: TCacheChatKey, messages: ISupportChatMessage[]) {
    while (this.cachedChats.size > this.max) {
      this.cachedChats.delete(this.cachedChats.keys().next().value!)
    }

    this.cachedChats.set(key, { messages })
  }

  getChat(key: TCacheChatKey) {
    return this.cachedChats.get(key)
  }
}

export const supportChatCache = new SupportChatCache()
