'use client'

import { ChangeEventHandler, useState } from 'react'

import { createCheckoutSession } from '@/actions/stripe'
import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '@/config'
import { formatAmountForDisplay } from '@/utils/stripe'

import { Button, Field, Input, Label } from '@/components/ui'

type DonationFrequency = 'day' | 'week' | 'month' | 'year'

const frequencyAdverb: Record<DonationFrequency, string> = {
  day: 'daily',
  week: 'weekly',
  month: 'monthly',
  year: 'yearly',
}

const frequencyOptions: { [key in DonationFrequency]: { value: key; label: string } } = {
  day: {
    value: 'day',
    label: 'Daily',
  },
  week: {
    value: 'week',
    label: 'Weekly',
  },
  month: {
    value: 'month',
    label: 'Monthly',
  },
  year: {
    value: 'year',
    label: 'Yearly',
  },
}

export function RegularDonationForm() {
  const [input, setInput] = useState<{
    amount: number
    frequency: DonationFrequency
  }>({
    amount: MIN_AMOUNT,
    frequency: 'month',
  })
  const [loading, setLoading] = useState<boolean>(false)

  const handleInputChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
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
        <input type="hidden" name="form" value="regular" />
        <input type="hidden" name="type" value="subscription" />
        <div className="space-y-4">
          <Field>
            <Label htmlFor="frequency" required>
              Frequency
            </Label>
            <select
              id="frequency"
              name="frequency"
              value={input.frequency}
              onChange={handleInputChange}
            >
              {Object.values(frequencyOptions).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field>
            <Label htmlFor="amount" required>
              Amount
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
            {`Donate ${formatAmountForDisplay(input.amount, CURRENCY)} ${frequencyAdverb[input.frequency]}`}
          </Button>
        </div>
      </form>
    </div>
  )
}
