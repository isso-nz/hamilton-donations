import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { DollarSign } from 'lucide-react'

interface AmountProps {
  amount: number
  onChange: (amount: number) => void
  min?: number
  max?: number
}

export function Amount({ amount, onChange, min = 0, max }: AmountProps) {
  return (
    <>
      <Label htmlFor="amount">Amount</Label>
      <ButtonGroup className="w-full">
        <Button type="button" size="icon" variant="outline">
          <DollarSign />
        </Button>
        <Input
          className="w-full"
          type="number"
          id="amount"
          name="amount"
          value={amount}
          onChange={(event) => onChange(Number(event.currentTarget.value))}
          inputMode="numeric"
          pattern="[0-9]*"
          min={min}
          max={max}
          placeholder="Amount to donate"
          required
        />
      </ButtonGroup>
    </>
  )
}
