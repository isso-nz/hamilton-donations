import { Metadata } from 'next'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

export const metadata: Metadata = {
  title: 'Regular donation',
}

export default function RegularDonationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header title="Regular donation" />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {children}

        <Footer />
      </div>
    </>
  )
}
