import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex justify-center flex-col text-center gap-4">
        <h1 className="text-4xl font-bold">ISSO Hamilton</h1>
        <p className="max-w-screen-sm">Do you want to donate once off for an event or repeatedly donate towards a seva? </p>
      </div>
      <div className="flex justify-center gap-4 pt-12">
        <Link 
          href={"/once"}
        >
          <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Donate Once Off
          </div>
        </Link>

      </div>
    </main>
  );
}
