import type { ShallowRef } from 'vue'
import { useSupportChatEcho } from '~/domain/support/chat/composeables/useSupportChatEcho'
import { useSupportChatLoading } from '~/domain/support/chat/composeables/useSupportChatLoading'
import { useSupportChatUi } from '~/domain/support/chat/composeables/useSupportChatUi'
import type { ISupportChatInfo } from '~/domain/support/chat/interfaces/ISupportChatInfo'
import type { ISupportChatMessagesList } from '~/domain/support/chat/interfaces/ISupportChatMessagesList'
import { supportChatCache } from '~/domain/support/chat/SupportChatCache'
import { useSupportChatStore } from '~/stores/supportChat/useSupportChatStore'

export async function useSupportChatGeneral(
  chatBodyElement: ShallowRef<HTMLElement | null>,
  topSpyElement: ShallowRef<HTMLElement | null>,
  bottomSpyElement: ShallowRef<HTMLElement | null>,
  chat_id?: MaybeRefOrGetter<number>
) {
  const store = useSupportChatStore(chat_id)
  const { setReadAt, appendMessages } = store
  const {
    chatInfo,
    allLaterMessagesLoaded,
    isFirstLoading,
    messages,
    savedScrollPosition,
  } = storeToRefs(store)

  const { addNotification } = useNotifications()

  const { loadChatInfo } = useSupportChatLoading(chat_id)
  const { echoSubscribe } = useSupportChatEcho(chat_id)
  const { loadMoreBottom } = useSupportChatUi(
    chatBodyElement,
    topSpyElement,
    bottomSpyElement,
    chat_id
  )

  // кэшировать предыдущий чат, если есть
  if (chatInfo.value) {
    const key = chat_id ? chatInfo.value.chat_id : 'user'
    supportChatCache.storeChat(key, {
      messages: messages.value,
      savedScrollPosition: savedScrollPosition.value,
    })
  }

  // попытаться достать из кэша
  let cachedChat = supportChatCache.getChat(chat_id ? toValue(chat_id) : 'user')
  if (cachedChat) {
    messages.value = cachedChat.messages
    // savedScrollPosition.value = cachedChat.savedScrollPosition
    await Promise.all([loadMoreBottom(), loadChatInfo()])
  }
  // если в кэше нет - загрузить
  else await initialLoad()

  async function initialLoad() {
    isFirstLoading.value = true

    const [
      { data: chatInfoData, error: chatInfoError },
      { data: messagesData, error: messagesError },
    ] = await Promise.all([
      useAPI<{ data: ISupportChatInfo }>('/support-chat/', {
        credentials: 'include',
        query: {
          chat_id,
        },
        watch: false,
      }),
      useAPI<{ data: ISupportChatMessagesList }>('/support-chat/messages', {
        credentials: 'include',
        query: {
          chat_id,
        },
        watch: false,
      }),
    ])

    if (chatInfoError.value && chatInfoError.value.statusCode !== 404) {
      isFirstLoading.value = false
      throw createError(chatInfoError.value)
    }

    if (
      chat_id &&
      chatInfoError.value?.statusCode === 404 &&
      typeof window !== 'undefined'
    ) {
      addNotification('error', chatInfoError.value.data.message, 30000)
    }

    chatInfo.value = chatInfoData.value?.data
    messages.value = []
    appendMessages(messagesData.value?.data.messages ?? [])

    isFirstLoading.value = false
  }

  async function onMessageWritten() {
    // если у пользователя ещё нет чата - он будет создан при первом написании сообщения, поэтому его нужно загрузить
    if (!chatInfo.value) {
      await initialLoad()
      echoSubscribe()
    }

    // если загружены не все последние сообщения - дозагрузить и выставить всем текущим прочитанное состояние
    if (!allLaterMessagesLoaded.value) {
      setReadAt()
      await loadMoreBottom(true)
    }

    await nextTick()
    chatBodyElement.value?.scrollTo({ top: chatBodyElement.value.scrollHeight })
  }

  return { onMessageWritten }
}
