'use client'

import { useState, useTransition } from 'react'

import { createCheckoutSession } from '@/actions/stripe'
import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '@/config'
import { formatAmountForDisplay } from '@/utils/stripe'

import {
  Button,
  Field,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'

import { DonationType } from './donation-type'

type DonationFrequency = 'day' | 'week' | 'month' | 'year'

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
  const [amount, setAmount] = useState<number>(MIN_AMOUNT)
  const [frequency, setFrequency] = useState<DonationFrequency>('month')

  const [isPending, startTransition] = useTransition()

  async function submitAction(data: FormData): Promise<void> {
    startTransition(async () => {
      const { url } = await createCheckoutSession(data)
      window.location.assign(url as string)
    })
  }

  return (
    <div className="flex w-full flex-col space-y-4">
      <form action={submitAction}>
        <input type="hidden" name="form" value="regular" />
        <input type="hidden" name="type" value="subscription" />
        <div className="space-y-6 sm:space-y-4">
          <DonationType form="regular" />

          <Field>
            <Label htmlFor="frequency" required>
              Frequency
            </Label>
            <Select
              name="frequency"
              value={frequency}
              onValueChange={(value) => setFrequency(value as any)}
              required
            >
              <SelectTrigger id="frequency">
                <SelectValue placeholder="How frequently would you like to donate" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(frequencyOptions).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                value={amount}
                onChange={(event) => setAmount(Number(event.currentTarget.value))}
                inputMode="numeric"
                pattern="[0-9]*"
                min={MIN_AMOUNT}
                max={MAX_AMOUNT}
                placeholder="Amount to donate"
                required
              />
            </div>
          </Field>
        </div>

        <div className="mt-6">
          <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
            {`Donate ${formatAmountForDisplay(amount, CURRENCY)} per ${frequency}`}
          </Button>
        </div>
      </form>
    </div>
  )
}
