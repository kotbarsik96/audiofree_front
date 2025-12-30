import type { ISupportChatInfo } from "~/domain/support/chat/interfaces/ISupportChatInfo";

export interface ISupportChatChangedInfoEvent {
  chat_info: ISupportChatInfo
}