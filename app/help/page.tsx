"use client"

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex justify-center flex-col text-center gap-4">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p>We could not process your payment, please contact us on <a className="font-bold" href="mailto:hamilton.mandir@nndym.org">hamilton.mandir@nndym.org</a></p>
      </div>
      <div className="flex justify-center gap-4 pt-12">
        <Link 
          href={"/"}
        >
          <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go back home
          </div>
        </Link>
      </div>
    </main>
  );
}
