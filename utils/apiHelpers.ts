import type { NotificationSeverity } from '~/enums/notification/NotificationSeverety'

export interface IShowResponseMessageOptions {
  /** не выводить сообщение при ошибке */
  noErrorResponse?: boolean
  /** не выводить сообщение при успехе */
  noOkResponse?: boolean
  /** severity уведомления при ошибке */
  errorSeverity?: NotificationSeverity
  /** severity уведомления при успехе */
  okSeverity?: NotificationSeverity
}

/** выведет сообщение из response */
export function showResponseMessage(
  response: Response & { _data?: any },
  options: IShowResponseMessageOptions = {}
) {
  const { addNotification } = useNotifications()

  if (response._data.message) {
    const severity = response.ok
      ? options.okSeverity || 'info'
      : options.errorSeverity || 'error'

    if (response.ok && !options.noOkResponse)
      addNotification(severity, response._data.message)
    if (!response.ok && !options.noErrorResponse)
      addNotification(severity, response._data.message)
  }
}
