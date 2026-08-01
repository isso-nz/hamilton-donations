'use client'

import { useState, useTransition } from 'react'

import { createCheckoutSession } from '@/actions/stripe'
import { CURRENCY, MAX_AMOUNT, MIN_AMOUNT } from '@/config'
import { donationTypes } from '@/config/donations'
import { formatAmountForDisplay } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

import { DonationType } from './donation-type'
import { Amount } from './amount'

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
  const [selectedType, setSelectedType] = useState<string>('')
  const [amount, setAmount] = useState<number>(MIN_AMOUNT)
  const [frequency, setFrequency] = useState<DonationFrequency>('month')

  const [isPending, startTransition] = useTransition()

  // Get the selected donation type to check if it has a fixed amount
  const selectedDonationType = donationTypes.find((type) => type.name === selectedType)
  const hasFixedAmount = selectedDonationType?.fixedAmount !== undefined
  const displayAmount = hasFixedAmount ? selectedDonationType.fixedAmount! : amount

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
        {hasFixedAmount && <input type="hidden" name="amount" value={displayAmount.toString()} />}
        <div className="space-y-6 sm:space-y-4">
          <DonationType form="regular" onSelect={setSelectedType} />

          {!hasFixedAmount && (
            <>
              <Field>
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  name="frequency"
                  value={frequency}
                  onValueChange={(value) => setFrequency(value as any)}
                  required
                >
                  <SelectTrigger id="frequency" className="w-full">
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
                <Amount
                  amount={amount}
                  onChange={(amount) => setAmount(amount)}
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                />
              </Field>
            </>
          )}

          {hasFixedAmount && (
            <Field>
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                name="frequency"
                value={frequency}
                onValueChange={(value) => setFrequency(value as any)}
                required
              >
                <SelectTrigger id="frequency" className="w-full">
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
          )}
        </div>

        <div className="mt-6">
          <Button type="submit" className="w-full" disabled={isPending || !selectedType}>
            {`Donate ${formatAmountForDisplay(displayAmount, CURRENCY)}${!hasFixedAmount ? ` per ${frequency}` : ` per ${frequency}`}`}
          </Button>
        </div>
      </form>
    </div>
  )
}
