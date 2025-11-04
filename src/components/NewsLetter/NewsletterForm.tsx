"use client";

import { useState } from "react";
import { useSubscribeNewsletterMutation } from "@/redux/features/newsletter/newsletterAPI";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const [subscribe, { isLoading: isSubscribing, error: subscriptionError }] =
    useSubscribeNewsletterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubscribing) return;

    console.log("🔍 Debug Info:");
    console.log("Base URL:", process.env.NEXT_PUBLIC_API_URL2);
    console.log("Endpoint:", "/newsletter/subscribe");
    console.log(
      "Full URL dovrebbe essere:",
      process.env.NEXT_PUBLIC_API_URL2 + "/newsletter/subscribe"
    );

    setStatus("Iscrizione in corso...");

    try {
      await subscribe({ email }).unwrap();

      setStatus("Iscrizione avvenuta con successo! Controlla la tua email.");
      setEmail("");
    } catch (error: any) {
      let errorMessage = "Qualcosa è andato storto.";

      if (error.data && error.data.message) {
        errorMessage = error.data.message;
      } else if (error.data && error.data.errorMessages) {
        errorMessage =
          error.data.errorMessages[0]?.message || error.data.message;
      } else if (error.status === "FETCH_ERROR") {
        errorMessage =
          "Errore di rete/connessione. Il backend è inattivo o la porta è errata (dovrebbe essere 5000).";
      }

      setStatus("Errore: " + errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Blocco Mobile/Small Screens */}
      <div className="w-full lg:hidden flex items-center justify-between border border-gray-800 rounded-md">
        <input
          className="w-[60%] text-sm border-none outline-none bg-transparent text-[#FDFDFD] px-2.5 py-3"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubscribing}
        />
        <button
          type="submit"
          className="w-[40%] place-items-end bg-[#FDFDFD] text-[#101010] text-base font-medium rounded py-2.5 px-4 md:px-8"
          disabled={isSubscribing}>
          {isSubscribing ? "Invio..." : "Iscriviti"}
        </button>
      </div>

      {/* Blocco Desktop/Large Screens */}
      <div className="w-full lg:w-[50%] hidden lg:flex items-center justify-between border border-gray-800 rounded-md">
        <input
          className="border-none text-sm outline-none bg-transparent text-[#FDFDFD] px-2.5 py-3"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubscribing}
        />
        <button
          type="submit"
          className="place-items-end bg-[#FDFDFD] text-[#101010] text-base font-medium rounded py-2.5 px-4 md:px-8"
          disabled={isSubscribing}>
          {isSubscribing ? "Invio..." : "Iscriviti"}
        </button>
      </div>

      {/* Messaggio di stato */}
      {status && (
        <p className="mt-2 text-center text-sm text-[#FDFDFD]">{status}</p>
      )}
    </form>
  );
};

export default NewsletterForm;
