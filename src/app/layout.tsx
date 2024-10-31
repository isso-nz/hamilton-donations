import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import cn from 'clsx'

import './globals.css'

const dmSans = DM_Sans({ weight: ['400', '500', '600', '700'], subsets: ['latin'] })

interface LayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: {
    default: 'ISSO Hamilton',
    template: '%s | ISSO Hamilton',
  },
  description: 'ISSO Hamilton',
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={cn(dmSans.className, 'h-full')}>
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">{children}</div>
      </body>
    </html>
  )
}
