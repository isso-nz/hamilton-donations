"use client"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import RegularPaymentForm from "../components/PaymentForm/RegularPaymentForm";
import Link from "next/link";
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Link 
          href={"/"}
        >
        <div className=" mb-8 hover:bg-blue-100 text-blue-500 font-bold py-2 px-4 rounded">
          Go back home
        </div>
      </Link>
      <div className="flex justify-center flex-col text-center gap-4">
        <h1 className="text-4xl font-bold">Regular donation</h1>
        <p>You can make a regular donations to a seva or an event, select from the options below </p>
      </div>
      <div className="flex justify-center gap-4 pt-12">
        <Elements stripe={stripePromise}>
            <RegularPaymentForm />
        </Elements>
      </div>
    </main>
  );
}
