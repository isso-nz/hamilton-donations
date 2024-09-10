import Image from 'next/image'
import Link from 'next/link'

import { Button } from './components/ui'
import { Footer } from './components/footer'
import { Header } from './components/header'

export default function Home() {
  return (
    <>
      <Header />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <p className="text-center text-base text-zinc-700 sm:text-sm">
          Would you like to make a one-time donation for an event, or contribute
          regularly to a seva or event?
        </p>
        <div className="mt-6 space-y-4">
          <Button className="w-full" asChild>
            <Link href="/one-time">One-time donation</Link>
          </Button>

          <p className="text-center text-xs font-semibold uppercase text-zinc-500">
            or
          </p>

          <Button variant="primary" className="w-full" asChild>
            <Link href="/regular">Regular donation</Link>
          </Button>
        </div>

        <Footer />
      </div>
    </>
  )
}
