export interface DonationType {
  name: string
  recurring: boolean
}

export const donationTypes: DonationType[] = [
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
  {
    name: 'Tulsi Vivah',
    recurring: false,
  },
]
