export interface IConfirmationDialog {
  title: string
  detail?: string
  yesButtonText?: string
  noButtonText?: string
}

export interface IConfirmationCreated extends IConfirmationDialog {
  id: string
  resolve: (value: boolean) => void
}

let confirmationsList = ref<IConfirmationCreated[]>([])

export function useConfirmation() {
  let _defaultData = {
    yesButtonText: 'Да',
    noButtonText: 'Отмена',
  }

  function addConfirm(data: IConfirmationDialog) {
    let _data = Object.assign(_defaultData, data)

    return new Promise<boolean>((resolve) => {
      confirmationsList.value.push({
        id: crypto.randomUUID(),
        resolve,
        ..._data,
      })
    })
  }
  function removeDialog(id: string) {
    confirmationsList.value = confirmationsList.value.filter((i) => i.id !== id)
  }

  return {
    confirmationsList,
    addConfirm,
    removeDialog,
  }
}
