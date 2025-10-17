"use client";

import { modifiedCart } from "@/redux/features/cart/TrackCartItem";
import { useGetOrderQuery } from "@/redux/features/order/OrderAPI";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function PaymentSuccess() {
  const dispatch = useDispatch();
  const query = useSearchParams();
  const router = useRouter();
  const orderId = query.get("orderId");

  // Se l'ID dell'ordine non è presente, reindirizza.
  if (!orderId) {
    router.push("/cart");
    return null;
  }

  // Recupera i dati dell'ordine per la visualizzazione sulla pagina.
  // La finalizzazione dell'ordine (vendita/stock) è gestita dal Webhook del server.
  const customer = JSON.parse(localStorage?.getItem("customer") || "{}")?._id;
  const { data: order } = useGetOrderQuery({
    orderId: orderId,
    customer,
  });

  // LOGICA CRUCIALE DI PULIZIA
  useEffect(() => {
    // Ci assicuriamo che i dati dell'ordine siano stati caricati prima di procedere.
    if (order?.data?._id) {
      // 1. Pulisce lo stato del carrello in Redux
      dispatch(modifiedCart({}));

      // 2. Pulisce i dati locali
      const cart = localStorage?.getItem("cart");

      if (cart && JSON.parse(cart).length > 0) {
        localStorage?.removeItem("cart");

        // Pulisce anche i dati di trade-in/pagamento temporanei usati nel checkout
        localStorage?.removeItem("tradeInData");
        localStorage?.removeItem("bank");
        localStorage?.removeItem("paypal");

        // Ricarica la pagina per assicurare l'aggiornamento dell'UI (es. icona carrello)
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }
  }, [order, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-500 p-6 flex justify-center">
          <div className="rounded-full bg-white p-2">
            <Check className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">
              Payment Successful!
            </h1>
            <p className="text-gray-600">
              Your order has been processed successfully.
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
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-800">
                {order?.data?.payment_method}
              </span>
            </div>
          </div>

          {/* I link di navigazione e i pulsanti sono stati commentati nel tuo codice originale. 
              Li lascio commentati qui per mantenere la parità. 
            <div className="space-y-3"> ... </div> */}
        </div>

        {/* <div className="bg-gray-50 p-4 text-center"> ... </div> */}
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          What happens next?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">1</span>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Order Processing</h3>
            <p className="text-gray-600 text-sm">
              Your order is now being processed by our team.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Shipping</h3>
            <p className="text-gray-600 text-sm">
              Your items will be shipped within 1-2 business days.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">3</span>
            </div>
            <h3 className="font-medium text-gray-800 mb-2">Delivery</h3>
            <p className="text-gray-600 text-sm">
              Estimated delivery time is 3-5 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
