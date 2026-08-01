export interface DonationType {
  name: string
  recurring: boolean
  fixedAmount?: number
}

export const donationTypes: DonationType[] = [
  { name: 'Thal', recurring: true },
  { name: 'General Seva', recurring: true },
  { name: 'Aarti', recurring: true },
  // Shiv Poojan is a one-off fixed donation
  { name: 'Shiv Poojan', recurring: false, fixedAmount: 25.0 },
]
