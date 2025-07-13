import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET_ID!)
      .update(sign.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Signature matches — payment is valid!
      console.log("Payment verified successfully ✅");

      // TODO: Update your DB order status here

      return NextResponse.json({ status: "ok" });
    } else {
      // Signature mismatch — possible fraud
      ("Payment verification failed ❌");
      return NextResponse.json({ status: "invalid signature" }, { status: 400 });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
