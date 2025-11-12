import React from "react";
import Image from "next/image";
import { Truck, RefreshCw, ShieldCheck } from "lucide-react";

interface TrustSectionProps {
  // Rende lo sfondo e i margini esterni configurabili
  className?: string;
  // Rende lo sfondo interno dei blocchi configurabile
  innerBlockBgClass?: string;
}

const TrustSection: React.FC<TrustSectionProps> = ({
  className = "px-5 py-4", // Valore di default se non specificato
  innerBlockBgClass = "bg-[#FDFDFD]", // Valore di default
}) => {
  return (
    <div className={className}>
      {/* 1. Blocchetto Pagamento a Rate */}
      <div
        className={`${innerBlockBgClass} p-4 mb-4 rounded-lg shadow-md border`}>
        <div className="flex items-center justify-center space-x-2">
          <p className="text-xl font-bold text-[#101010]">Paga in 3 rate con</p>
          <Image
            src="/payments/paypal2.svg"
            alt="PayPal"
            width={75}
            height={20}
            className="h-5 w-auto"
          />
          <p className="text-xl font-bold text-[#101010]">o</p>
          <Image
            src="/payments/klarna.png"
            alt="Klarna"
            width={40}
            height={20}
            className="h-10 w-auto"
          />
        </div>
        <p className="text-base text-center text-gray-700 mt-1">
          senza interessi ne costi aggiuntivi.
        </p>
      </div>

      {/* 2. Blocchetto Vantaggi (Garanzia, Spedizione, Reso) */}
      <div
        className={`${innerBlockBgClass} p-4 rounded-lg shadow-md space-y-4`}>
        {/* Vantaggio 1: Garanzia */}
        <div className="flex items-center space-x-3">
          <ShieldCheck className="h-6 w-6 text-gray-600 flex-shrink-0" />
          <p className="text-lg text-[#101010] font-medium">
            Ricondizionato -
            <span className="font-bold">12 Mesi di garanzia.</span>
          </p>
        </div>

        {/* Vantaggio 2: Spedizione */}
        <div className="flex items-center space-x-3">
          <Truck className="h-6 w-6 text-gray-600 flex-shrink-0" />
          <p className="text-lg text-[#101010] font-medium">
            <span className="font-bold">Spedizione Veloce e Gratuita.</span>
          </p>
        </div>

        {/* Vantaggio 3: Reso */}
        <div className="flex items-center space-x-3">
          <RefreshCw className="h-6 w-6 text-gray-600 flex-shrink-0" />
          <p className="text-lg text-[#101010] font-medium">
            Hai cambiato idea?
            <span className="font-bold">Il reso è gratuito.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustSection;
