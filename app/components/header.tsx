'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface HeaderProps {
  title?: string
}

export function Header({ title = 'Jay Swaminarayan' }: HeaderProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-sm">
      <Image
        src="/isso-logo.svg"
        alt="ISSO New Zealand Logo"
        className="mx-auto h-16 w-auto"
        width={64}
        height={64}
      />
      <div className="mt-10 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          ISSO Hamilton
        </p>
        <h1 className="text-2xl/9 font-bold tracking-tight text-zinc-900">
          {title}
        </h1>
      </div>

      {pathname !== '/' && (
        <>
          <Link href="/" className="mt-6 flex text-sm underline">
            <span>&#8592; Back home</span>
          </Link>
        </>
      )}
    </div>
  )
}
