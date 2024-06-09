import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative h-screen">
      <Image
        src="/isso_ham_1.jpeg"
        alt="Picture of the girl holding god's idol"
        style={
          {
            objectFit: "cover"
          }
        }
        fill
      />
      <div className="z-50 absolute left-0 top-0 flex justify-center flex-col items-center h-full">
        <div className="bg-white p-8 md:p-16 rounded-md mx-4 md:ml-8 lg:ml-20 shadow-md">
          <Image
            src="/isso-logo.svg"
            alt="ISSO New Zealand Logo"
            className="pb-4"
            width={70}
            height={70}
          />
          <h1 className="text-3xl font-bold mb-2">ISSO Hamilton</h1>
          <p className="max-w-[400px]">Do you want to donate once off for an event or repeatedly donate towards a seva? </p>
          <div className="">
            <Link 
              href={"/once"}
            >
              <div className="bg-blue-500 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded mt-4">
                Donate Once Off
              </div>
            </Link>
            <Link 
              href={"/regular"}
            >
              <div className="bg-blue-500 hover:bg-blue-700 text-white text-center  font-bold py-2 px-4 rounded mt-4">
                Regular Donation
              </div>
            </Link>
          </div>
          <p className="max-w-[400px] pt-6">If you have already made a donation/need to cancel, please contact <a className="font-bold" href="mailto:vidur.ratna@nndym.org">vidur.ratna@nndym.org</a></p>
        </div>
      </div>
    </main>
  );
}

{/* <main className="flex min-h-screen flex-col items-center p-24">
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
        <Link 
          href={"/regular"}
        >
          <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Regular Donation
          </div>
        </Link>
      </div>
    </main> */}