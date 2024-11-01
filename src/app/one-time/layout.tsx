import { Metadata } from 'next'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

export const metadata: Metadata = {
  title: 'One-time donation',
}

export default function OneTimeDonationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header title="One-time donation" />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {children}

        <Footer />
      </div>
    </>
  )
}
