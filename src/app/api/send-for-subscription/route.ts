import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2024-04-10",
});

export async function POST(req: NextRequest, res: NextResponse) {
  const { data } = await req.json();
  const { item, customer_id } = data;
  try {
    const paymentIntent = await stripe.subscriptions.create({
        customer: customer_id,
        payment_behavior: 'default_incomplete',
        items: [
            { price: item },
        ],
        expand: ['latest_invoice.payment_intent'],
    });

    const _data = {
        data: {
            code: "subscription_created",
            subscriptionId: paymentIntent.id,
            // @ts-ignore
            clientSecret: paymentIntent.latest_invoice.payment_intent.client_secret,
        }
    }

    return NextResponse.json(_data, { status: 200 });

  } catch (error: any) {
    return new NextResponse(error, {
      status: 400,
    });
  }
}