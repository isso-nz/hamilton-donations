"use client"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OncePaymentForm from "../components/PaymentForm/OncePaymentForm";
import Link from "next/link";
import Image from "next/image";
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
export default function Home() {
  return (
    <main className="relative h-screen">
      <Image
        src="/isso_ham_1.jpg"
        alt="Picture of the girl holding god's idol"
        style={
          {
            objectFit: "cover"
          }
        }
        fill
      />
      <div className="z-50 absolute left-0 top-0 flex justify-center flex-col items-center h-full">
        <div className="bg-white p-8 md:p-16 rounded-md mx-4 md:ml-8 lg:ml-20 shadow-md flex flex-col items-start">
          <Link 
            href={"/"}
            className="flex space-x-2 items-center mb-4 bg-blue-100 hover:bg-blue-300 text-blue-900 font-semibold py-2 px-4 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 opacity-50">
              <path fillRule="evenodd" d="M18 10a.75.75 0 0 1-.75.75H4.66l2.1 1.95a.75.75 0 1 1-1.02 1.1l-3.5-3.25a.75.75 0 0 1 0-1.1l3.5-3.25a.75.75 0 1 1 1.02 1.1l-2.1 1.95h12.59A.75.75 0 0 1 18 10Z" clipRule="evenodd" />
            </svg>
            <span>
              Go back home
            </span>
          </Link>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">One off donation</h1>
          <p className="max-w-[400px]">You can make a one off donation to a seva or an event, fill out the reason for donation.</p>
          <div className="flex justify-center gap-4 pt-6">
          <Elements stripe={stripePromise}>
              <OncePaymentForm />
          </Elements>
          </div>
          <p className="max-w-[400px] pt-6">If you have already made a donation/need to cancel, please contact <a className="font-bold" href="mailto:hamilton.mandir@nndym.org">hamilton.mandir@nndym.org</a></p>
        </div>
      </div>
    </main>
  );
}