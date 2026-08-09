import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required Razorpay payment verification parameters." },
        { status: 400 }
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret || key_secret.includes("YOUR_RAZORPAY_LIVE_SECRET")) {
      return NextResponse.json(
        {
          success: false,
          error: "RAZORPAY_KEY_SECRET is not configured in server environment (.env.local). Cannot verify payment signature.",
        },
        { status: 400 }
      );
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      return NextResponse.json({
        success: true,
        message: "Razorpay payment signature verified successfully.",
        paymentId: razorpay_payment_id,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature! Payment verification failed." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Razorpay Verification Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal error during payment signature verification." },
      { status: 500 }
    );
  }
}
