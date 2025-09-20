import type IPagination from '~/dataAccess/api/IPagination'
import { SupportChat } from '~/domain/chats/support-chat/SupportChat'
import type { ISupportChatMessage } from '~/domain/chats/support-chat/interfaces/ISupportChatMessage'
import type { ISupportChat } from '~/domain/chats/support-chat/interfaces/ISupportChat'
import type { AsyncDataRequestStatus } from '#app'

export class SupportChatSupporter extends SupportChat implements ISupportChat {
  public page: Ref<number> = ref(1)
  public paginationData: Ref<IPagination<ISupportChatMessage[]> | null>
  public loadHistory: () => Promise<void>
  public newMessage: Ref<string>
  public chatId: MaybeRefOrGetter<string>
  public loadHistoryStatus: Ref<AsyncDataRequestStatus>
  public error: Ref

  constructor(fetch: typeof $fetch, chatId: MaybeRefOrGetter<string>) {
    super(fetch)
    this.sendMessage = this.sendMessage.bind(this)

    const {
      data: paginationData,
      error,
      execute: loadHistory,
      status,
    } = useAPI<IPagination<ISupportChatMessage[]>>(
      'support-chat/supporter/history',
      {
        credentials: 'include',
        query: {
          page: this.page,
          chat_id: toValue(chatId),
        },
        immediate: false,
        watch: false,
        onResponse: ({ response }) => {
          const messages = response._data?.data as ISupportChatMessage[]

          if (response.ok && messages) {
            messages.forEach((message) => this.prependMessage(message))
            const lastPage = this.paginationData.value?.last_page
            if (!lastPage || this.page.value <= lastPage) this.page.value += 1
          }
        },
      }
    )

    this.paginationData = paginationData
    this.loadHistory = loadHistory.bind(this)
    this.newMessage = ref('')
    this.chatId = chatId
    this.loadHistoryStatus = status
    this.error = error
  }

  public async sendMessage() {
    let responseOk = false

    await this.fetch('support-chat/supporter/message', {
      method: 'POST',
      credentials: 'include',
      body: {
        message: this.newMessage.value,
        chat_id: toValue(this.chatId),
      },
      onResponse: async ({ response }) => {
        const message = response._data.data.message as ISupportChatMessage
        if (response.ok && message) {
          responseOk = true
          this.appendMessage(message)
          this.newMessage.value = ''
        }
      },
      onResponseError() {
        responseOk = false
      },
    })

    return responseOk
  }
}
