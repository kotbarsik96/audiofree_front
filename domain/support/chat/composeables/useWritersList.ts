import type { ISupportChatWriter } from '~/domain/support/chat/interfaces/ISupportChatWriter'
import { maxSupportChatTypingDuration } from '~/domain/support/chat/maxSupportChatTypingDuration'

export function useWritersList() {
  const { timeSource } = useTimer()

  const _writersList = ref<ISupportChatWriter[]>([])

  const writersList = computed(() => _filterWritersList())

  const updateWriters = (writer: ISupportChatWriter) => {
    if (writer.started_writing_at) {
      let found = _writersList.value.find(
        (wr) => wr.id === writer.id && wr.chat_id === writer.chat_id
      )
      if (!found) {
        _writersList.value.push(writer)
        found = writer
      }

      found.started_writing_at = Date.now()
    } else
      _writersList.value = _writersList.value.filter(
        (wr) => wr.id !== writer.id
      )

    // очищать от лишнего
    _writersList.value = _filterWritersList()
  }

  function _filterWritersList() {
    return _writersList.value.filter(
      (wr) =>
        wr.started_writing_at &&
        timeSource.value < wr.started_writing_at + maxSupportChatTypingDuration
    )
  }

  return { writersList, updateWriters }
}
