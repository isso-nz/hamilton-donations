import { donationTypes } from '@/config/donations'
import {
  Field,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'

export interface DonationTypeProps {
  form: 'one-time' | 'regular'
}

export function DonationType({ form }: DonationTypeProps) {
  const types =
    form === 'regular' ? donationTypes.filter((option) => option.recurring) : donationTypes

  return (
    <Field>
      <Label htmlFor="reason" required>
        Donation type
      </Label>
      <Select name="reason" required>
        <SelectTrigger id="reason">
          <SelectValue placeholder="Type of donation you wish to make" />
        </SelectTrigger>
        <SelectContent>
          {types.map((option) => (
            <SelectItem key={option.name} value={option.name}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
