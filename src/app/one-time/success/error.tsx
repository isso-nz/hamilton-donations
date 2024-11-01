'use client'

import { AlertCircle } from '@/components/icons'
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui'

export default function Error({ error }: { error: Error }) {
  return (
    <Alert variant="critical">
      <AlertIcon>
        <AlertCircle />
      </AlertIcon>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  )
}
