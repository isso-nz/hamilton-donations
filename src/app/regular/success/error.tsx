'use client'

import { AlertCircle } from '@/components/icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Error({ error }: { error: Error }) {
  return (
    <Alert variant="destructive">
      <AlertCircle />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )
}
