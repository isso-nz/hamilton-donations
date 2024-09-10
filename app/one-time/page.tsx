import { Footer } from '../components/footer'
import { OneTimeDonationForm } from '../components/forms'
import { Header } from '../components/header'

export default function OneTimeDonation() {
  return (
    <>
      <Header title="One-time donation" />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <p className="text-center text-base text-zinc-700 sm:text-sm">
          You can choose to make a one-time donation to a seva or an event.
          Please select from the options below.
        </p>

        <div className="mt-6 space-y-4">
          <div className="flex justify-center gap-4 pt-6">
            <OneTimeDonationForm />
          </div>

          <Footer />
        </div>
      </div>
    </>
  )
}
