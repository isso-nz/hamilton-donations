import Image from 'next/image'
import Link from 'next/link'
import { Button } from './components/ui'

export default function Home() {
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          src="/isso-logo.svg"
          alt="ISSO New Zealand Logo"
          className="mx-auto h-16 w-auto"
          width={64}
          height={64}
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-zinc-900">
          ISSO Hamilton
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <p className="text-center text-sm text-zinc-700">
          Do you want to donate one off for an event or repeatedly donate
          towards a seva?{' '}
        </p>
        <div className="mt-6 space-y-4">
          <Button className="w-full" asChild>
            <Link href={'/once'}>One off donation</Link>
          </Button>

          <p className="text-center text-xs font-semibold uppercase text-zinc-500">
            or
          </p>

          <Button variant="primary" className="w-full" asChild>
            <Link href={'/regular'}>Regular donation</Link>
          </Button>
        </div>
        <p className="mt-6 text-center text-sm text-zinc-600">
          If you have already made a donation/need to cancel, please contact{' '}
          <a
            className="font-bold hover:underline"
            href="mailto:hamilton.mandir@nndym.org"
          >
            hamilton.mandir@nndym.org
          </a>
        </p>
      </div>
    </>
  )
}
