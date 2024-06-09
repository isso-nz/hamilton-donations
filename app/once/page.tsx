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
          >
            <div className=" mb-4 bg-blue-100 hover:bg-blue-300 text-black font-bold py-2 px-4 rounded">
              Go back home
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Once off donation</h1>
          <p className="max-w-[400px]">You can make a one off donation to a seva or an event, just fill out the reason for donation </p>
          <div className="flex justify-center gap-4 pt-6">
          <Elements stripe={stripePromise}>
              <OncePaymentForm />
          </Elements>
          </div>
          <p className="max-w-[400px] pt-6">If you have already made a donation/need to cancel, please contact <a className="font-bold" href="mailto:vidur.ratna@nndym.org">vidur.ratna@nndym.org</a></p>
        </div>
      </div>
    </main>
  );
}