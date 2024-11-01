import { RegularDonationForm } from '@/components/forms'

export default function RegularDonation() {
  return (
    <>
      <p className="text-center text-base text-zinc-700 sm:text-sm">
        You can choose to make regular donations to a seva or event. Please recurring set your
        donation amount below.
      </p>

      <div className="mt-6 space-y-4">
        <div className="flex justify-center gap-4 pt-6">
          <RegularDonationForm />
        </div>
      </div>
    </>
  )
}
