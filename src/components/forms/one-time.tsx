'use client'

import { ChangeEventHandler, useState } from 'react'

import { createCheckoutSession } from '@/actions/stripe'
import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '@/config'
import { formatAmountForDisplay } from '@/utils/stripe'

import { Button, Field, Input, Label } from '@/components/ui'

export function OneTimeDonationForm() {
  const [input, setInput] = useState({
    amount: MIN_AMOUNT,
  })
  const [loading, setLoading] = useState<boolean>(false)

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    })
  }

  async function formAction(data: FormData): Promise<void> {
    setLoading(true)

    const { url } = await createCheckoutSession(data)
    window.location.assign(url as string)
  }

  return (
    <div className="flex w-full flex-col space-y-4">
      <form action={formAction}>
        <input type="hidden" name="form" value="one-time" />
        <input type="hidden" name="type" value="payment" />
        <div>
          <Field>
            <Label htmlFor="amount" required>
              Donation amount
            </Label>
            <div className="flex items-center gap-2 rounded-lg bg-zinc-100 p-0.5 ring-1 ring-black/10">
              <span className="ml-2 shrink-0 font-medium sm:text-sm">$</span>
              <Input
                type="number"
                id="amount"
                name="amount"
                value={input.amount}
                onChange={handleInputChange}
                min={MIN_AMOUNT}
                max={MAX_AMOUNT}
                placeholder="Amount to donate"
                required
              />
            </div>
          </Field>
        </div>

        <div className="mt-6">
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {`Donate ${formatAmountForDisplay(input.amount, CURRENCY)}`}
          </Button>
        </div>
      </form>
    </div>
  )
}
