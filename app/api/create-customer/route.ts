import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2024-04-10",
});

export async function POST(req: NextRequest) {
  const { data } = await req.json();
  try {

    const exisingCustomer = await stripe.customers.list({
        email: data.email,
        limit: 1,
    });

    if (exisingCustomer.data.length > 0) {
        return new NextResponse(exisingCustomer.data[0].id, { status: 200 });
    }

    const customer = await stripe.customers.create({
        name: data.name,
        email: data.email,
    });

    return new NextResponse(customer.id, { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, {
      status: 400,
    });
  }
}