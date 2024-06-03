"use client"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OncePaymentForm from "../components/PaymentForm/OncePaymentForm";
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex justify-center flex-col text-center gap-4">
        <h1 className="text-4xl font-bold">Once off donation</h1>
        <p>You can make a one off donation to a seva or an event, just fill out the reason for donation </p>
      </div>
      <div className="flex justify-center gap-4 pt-12">
        <Elements stripe={stripePromise}>
            <OncePaymentForm />
        </Elements>
      </div>
    </main>
  );
}
