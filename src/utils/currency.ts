const eurFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })

export const formatEUR = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '–'
  return eurFormatter.format(amount)
}
