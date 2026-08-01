import { donationTypes } from '@/config/donations'
import { Field } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface DonationTypeProps {
  form: 'one-time' | 'regular'
  value?: string
  onValueChange?: (value: string) => void
}

export function DonationType({ form, value, onValueChange }: DonationTypeProps) {
  const types =
    form === 'regular' ? donationTypes.filter((option) => option.recurring) : donationTypes

  return (
    <Field>
      <Label htmlFor="reason">Donation type</Label>
      <Select name="reason" value={value} onValueChange={onValueChange} required>
        <SelectTrigger id="reason" className="w-full">
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
