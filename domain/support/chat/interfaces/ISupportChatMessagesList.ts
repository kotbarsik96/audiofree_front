import type { ISupportChatMessage } from '~/domain/support/chat/interfaces/ISupportChatMessage'

export interface ISupportChatMessagesList {
  messages: ISupportChatMessage[]
  earliest_loaded_id: number
  latest_loaded_id: number
}
