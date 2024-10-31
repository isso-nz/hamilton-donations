import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10',
  appInfo: {
    name: 'isso-new-zealand',
    url: 'https://isso.org.nz',
  },
})
