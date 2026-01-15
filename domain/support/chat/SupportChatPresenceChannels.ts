import type {
  EchoInstance,
  EchoPresenceChannel,
} from '~/domain/echo/interfaces/EchoInterfaces'

class SupportChatPresenceChannels {
  private list = new Map<number, EchoPresenceChannel>()

  private channelName = 'support-chat'

  getChannel(chatId: number) {
    return this.list.get(chatId)
  }

  hasChannel(chatId: number) {
    return this.list.has(chatId)
  }

  register(chatId: number, echo: EchoInstance) {
    if (!this.list.has(chatId)) {
      this.list.set(chatId, echo.join(`${this.channelName}.${chatId}`))
    }
    return this.list.get(chatId) as EchoPresenceChannel
  }

  /** вызывается, когда пользователь совсем уходит со страницы чата/списка чатов */
  leaveAll(echo: EchoInstance) {
    for (let chatId of this.list.keys()) {
      echo.leave(`${this.channelName}.${chatId}`)
    }
    this.list.clear()
  }
}

export const supportChatPresenceChannels = new SupportChatPresenceChannels()
