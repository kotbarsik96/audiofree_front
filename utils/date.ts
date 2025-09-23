export function formatMonthAndYear(date: string) {
  const d = new Date(date)
  const isCurrentYear = d.getFullYear() === new Date().getFullYear()

  return d.toLocaleDateString('ru-RU', {
    year: isCurrentYear ? undefined : 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(date: string) {
  const d = new Date(date)

  return d.toLocaleTimeString('ru-RU', {
    timeStyle: 'short'
  })
}
