import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: "Invalid amount specified" }, { status: 400 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (
      !key_id ||
      !key_secret ||
      key_id.includes("YOUR_KEY_ID") ||
      key_secret.includes("YOUR_RAZORPAY_LIVE_SECRET")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Razorpay Live credentials (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET) are not configured in environment variables (.env.local). Please set your live Razorpay credentials to accept real payments.",
        },
        { status: 400 }
      );
    }

    try {
      const instance = new Razorpay({
        key_id,
        key_secret,
      });

      const options = {
        amount: Math.round(amount * 100), // Amount in paise
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        notes: {
          store: "MATRIN Store",
        },
      };

      const order = await instance.orders.create(options);

      return NextResponse.json({
        success: true,
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: key_id,
      });
    } catch (sdkError: any) {
      console.error("Razorpay SDK order creation error:", sdkError?.message || sdkError);
      return NextResponse.json(
        {
          success: false,
          error: sdkError?.message || "Failed to create order with Razorpay Gateway",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Razorpay Order Route Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Internal server error creating payment order",
      },
      { status: 500 }
    );
  }
}
