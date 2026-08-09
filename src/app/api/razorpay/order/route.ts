import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount specified" }, { status: 400 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TI7pYn8TINBomI";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "SGxSxvaUR1ioGJ1hyHeCthyf";

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
      console.warn("Razorpay SDK order creation warning:", sdkError?.message || sdkError);
      return NextResponse.json({
        success: false,
        amount: Math.round(amount * 100),
        currency: "INR",
        keyId: key_id,
      });
    }
  } catch (error: any) {
    console.error("Razorpay Order Route Error:", error);
    return NextResponse.json({
      success: false,
      amount: 1000,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TI7pYn8TINBomI",
    });
  }
}
