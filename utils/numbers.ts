export function currency(
  num: number,
  options?: {
    maxFractionDigits: number
  }
) {
  return num.toLocaleString(undefined, {
    maximumFractionDigits: options?.maxFractionDigits || 0,
    currency: 'rub',
    style: 'currency',
  })
}
