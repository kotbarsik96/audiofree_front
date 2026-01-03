export enum ESupportChatSenderType {
  User = 'user',
  Staff = 'staff',
}

export const supportChatSenderTypeMap = {
  [ESupportChatSenderType.User]: 'Пользователь',
  [ESupportChatSenderType.Staff]: 'Сотрудник',
}
