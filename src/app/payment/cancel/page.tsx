"use client";

import { useGetOrderQuery } from "@/redux/features/order/OrderAPI";
import { X, ArrowLeft, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentCancel() {
  const router = useRouter();
  const query = useSearchParams();
  const { data: order } = useGetOrderQuery({ orderId: query.get("orderId") });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-orange-500 p-6 flex justify-center">
          <div className="rounded-full bg-white p-2">
            <X className="h-10 w-10 text-orange-500" />
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">Payment Failed</h1>
            <p className="text-gray-600">
              Your payment was not completed and no charges were made.
            </p>
          </div>

          <div className="border-t border-b border-gray-200 py-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number</span>
              <span className="font-medium text-gray-800">
                #{order?.data._id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-medium text-gray-800">
                {order?.data?.updatedAt?.split("T")[0]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-medium text-gray-800">
                ${order?.data?.amount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="font-medium text-red-600">
                {order?.data?.state}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={router.back}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-md transition-colors"
            >
              Try Payment Again
            </button>

            <Link
              href="/cart"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-md transition-colors"
            >
              Return to Cart
            </Link>

            <Link
              href="/buy"
              className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-700 py-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="bg-gray-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <HelpCircle className="h-5 w-5 text-gray-500" />
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-700 mb-1">Need help?</p>
              <p>
                If you're experiencing issues with your payment, please contact
                our support team for assistance.
              </p>
              <Link
                href="/support"
                className="text-orange-600 hover:text-orange-700 font-medium mt-2 inline-block"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Common Reasons for Payment Cancellation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow text-left">
            <h3 className="font-medium text-gray-800 mb-2">
              Insufficient Funds
            </h3>
            <p className="text-gray-600 text-sm">
              Your payment method may not have sufficient funds available for
              this transaction.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow text-left">
            <h3 className="font-medium text-gray-800 mb-2">
              Card Verification Failed
            </h3>
            <p className="text-gray-600 text-sm">
              The security verification for your card may have failed. Check
              your card details.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow text-left">
            <h3 className="font-medium text-gray-800 mb-2">
              Connection Issues
            </h3>
            <p className="text-gray-600 text-sm">
              A network or connection issue may have interrupted your payment
              process.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow text-left">
            <h3 className="font-medium text-gray-800 mb-2">
              Manual Cancellation
            </h3>
            <p className="text-gray-600 text-sm">
              You may have chosen to cancel the payment process yourself.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
