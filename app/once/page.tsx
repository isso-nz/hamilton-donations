"use client"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OncePaymentForm from "../components/PaymentForm/OncePaymentForm";
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
