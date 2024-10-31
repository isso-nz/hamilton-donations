import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2024-04-10",
});

export async function GET(req: NextRequest) {
  try {

    const products = await stripe.products.list({
        limit: 100,
        active: true
    });

    const prices = await stripe.prices.list({
        limit: 100
    });

    products.data.forEach((product: any) => {
        product.prices = prices.data.filter((price: any) => price.product === product.id);
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, {
      status: 400,
    });
  }
}