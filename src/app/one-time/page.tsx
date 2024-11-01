import { OneTimeDonationForm } from '@/components/forms'

export default function OneTimeDonation() {
  return (
    <>
      <p className="text-center text-base text-zinc-700 sm:text-sm">
        You can choose to make a one-time donation to a seva or an event. Please set your donation
        amount below.
      </p>

      <div className="mt-6 space-y-4">
        <div className="flex justify-center gap-4 pt-6">
          <OneTimeDonationForm />
        </div>
      </div>
    </>
  )
}
