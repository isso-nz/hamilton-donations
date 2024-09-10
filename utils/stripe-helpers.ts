export function formatAmountForDisplay(
  amount: number,
  currency: string
): string {
  let numberFormat = new Intl.NumberFormat(['en-NZ'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })

  return numberFormat.format(amount)
}
