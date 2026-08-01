export interface DonationType {
  name: string
  recurring: boolean
  fixedAmount?: number
}

export const donationTypes: DonationType[] = [
  { name: 'Thal', recurring: true },
  { name: 'General Seva', recurring: true },
  { name: 'Aarti', recurring: true },
  { name: 'Shiv Poojan', recurring: true, fixedAmount: 25.0 },
]
