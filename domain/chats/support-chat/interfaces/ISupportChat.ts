import type IPagination from '~/dataAccess/api/IPagination'
import type { ISupportChatMessage } from './ISupportChatMessage'
import type { IFormattedSupportChatMessage } from './IFormattedSupportChatMessage'
import type { AsyncDataRequestStatus } from '#app'

export interface ISupportChatBase {
  /** Список групп сообщений, разделённых датой */
  formattedMessages: Ref<IFormattedSupportChatMessage[]>

  /** Вставить сообщение в начало formattedMessages */
  prependMessage: (message: ISupportChatMessage) => void

  /** Вставить сообщение в конец formattedMessages */
  appendMessage: (message: ISupportChatMessage) => void

  /** Дата в формате dd.mm.yyyy */
  getDottedDate: (date: string) => string
}

export interface ISupportChat extends ISupportChatBase {
  /** Страница пагинации */
  page: Ref<number>

  /** Информация о пагинации. Получается путём запроса истории */
  paginationData: Ref<IPagination<ISupportChatMessage[]> | null>

  fetch: typeof $fetch

  loadHistoryStatus: Ref<AsyncDataRequestStatus>

  /** Новое сообщение. Используется в sendMessage */
  newMessage: Ref<string>

  /** Подгрузка новых сообщений с учётом page, paginationData.last_page */
  loadHistory: () => Promise<void>

  /** Отправка нового сообщения, взятого из newMessage */
  sendMessage: () => Promise<boolean>
}
