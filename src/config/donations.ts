export interface DonationType {
  name: string
  recurring: boolean
}

export const donationTypes: DonationType[] = [
  {
    name: 'Shiv Poojan',
    recurring: false,
  },
  {
    name: 'Thal',
    recurring: true,
  },
  {
    name: 'General Seva',
    recurring: true,
  },
  {
    name: 'Aarti',
    recurring: true,
  },
]
