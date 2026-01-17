import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'

export type TCacheChatKey = number | 'user'

export interface ISupportChatCacheData {
  messages: ISupportChatMessage[]
  savedScrollPosition: number | undefined
}

class SupportChatCache {
  private max = 4

  private cachedChats = new Map<TCacheChatKey, ISupportChatCacheData>()

  storeChat(key: TCacheChatKey, data: ISupportChatCacheData) {
    while (this.cachedChats.size > this.max) {
      this.cachedChats.delete(this.cachedChats.keys().next().value!)
    }

    this.cachedChats.set(key, data)
  }

  getChat(key: TCacheChatKey) {
    return this.cachedChats.get(key)
  }
}

export const supportChatCache = new SupportChatCache()
