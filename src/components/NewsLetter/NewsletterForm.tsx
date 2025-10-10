"use client";

import { useState } from "react";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Iscrizione in corso...");

    try {
      const response = await fetch("http://localhost:3000/api/v1/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("Iscrizione avvenuta con successo!");
        setEmail("");
      } else {
        setStatus("Errore: " + (data.message || "Qualcosa è andato storto."));
      }
    } catch (error) {
      setStatus("Errore di rete. Riprova più tardi.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="w-full lg:hidden flex items-center justify-between border border-gray-800 rounded-md">
        <input
          className="w-[60%] text-sm border-none outline-none bg-transparent text-[#FDFDFD] px-2.5 py-3"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-[40%] place-items-end bg-[#FDFDFD] text-[#101010] text-base font-medium rounded py-2.5 px-4 md:px-8">
          Iscriviti
        </button>
      </div>

      <div className="w-full lg:w-[50%] hidden lg:flex items-center justify-between border border-gray-800 rounded-md">
        <input
          className="border-none text-sm outline-none bg-transparent text-[#FDFDFD] px-2.5 py-3"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="place-items-end bg-[#FDFDFD] text-[#101010] text-base font-medium rounded py-2.5 px-4 md:px-8">
          Iscriviti
        </button>
      </div>
      {status && (
        <p className="mt-2 text-center text-sm text-[#FDFDFD]">{status}</p>
      )}
    </form>
  );
};

export default NewsletterForm;
