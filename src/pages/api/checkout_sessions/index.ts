/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextApiRequest, type NextApiResponse } from "next";
import Stripe from "stripe";

function formatAmountForStripe(amount: number, currency: string): number {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (const part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2020-08-27",
});

interface dataObjectType {
  vehicle_registration_number: string;
  client_uid: string;
  date_start: string;
  date_end: string;
  amount: number;
  outlet_uid: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const amount = (req.body as dataObjectType).amount;
    try {
      // Validate the amount that was passed from the client.
      if (!(amount >= 1 && amount <= 99999999)) {
        throw new Error("Invalid amount.");
      }
      // Create Checkout Sessions from body params
      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: "pay",
        payment_method_types: ["card"],
        line_items: [
          {
            name:
              "Hire Agreement for " +
              (req.body as dataObjectType).vehicle_registration_number,
            amount: formatAmountForStripe(amount, "SGD"),
            currency: "SGD",
            quantity: 1,
          },
        ],
        metadata: req.body,
        success_url: `${
          req.headers.origin as string
        }/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin as string}`,
      };
      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Internal server error";
      res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
