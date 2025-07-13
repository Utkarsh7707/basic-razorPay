'use client';
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import Script from "next/script";

export default function Home() {
  const [amount, setAmount] = useState<number>(0);

  async function createOrder() {
    try {
      const res = await axios.post('/api/createOrder', { amount : amount*100});
      const data = res.data;

      const paymentData = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: data.id,
        handler: async function (response: any) {
           try {
    const verify = await axios.post("/api/verifyOrder", {
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature
    });

    if (verify.data.status === "ok") {
      toast.success("Payment verified successfully!");
    } else {
      toast.error("Invalid payment signature!");
    }
  } catch (err) {
    console.error("Verification failed:", err);
    toast.error("Something went wrong verifying payment!");
  }

        },
      };

      const payment = new (window as any).Razorpay(paymentData);
      payment.open();

    } catch (error) {
      console.error("Error creating order:", error);
    }
  }

  return (
    <div className="flex w-screen h-screen items-center justify-center flex-col gap-5">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      
      <input
        type="number"
        placeholder="Enter amount"
        className="px-4 py-2 rounded-md text-black bg-white"
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <button
        onClick={createOrder}
        className="bg-green-400 text-white px-4 py-2 rounded-xl"
      >
        Create order
      </button>
    </div>
  );
}
