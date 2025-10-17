"use client";

import React, { useEffect } from "react";

declare global {
  interface Window {
    trustpilot: {
      invitation: (data: InvitationData) => void;
    };
  }
}

interface InvitationData {
  recipientEmail: string;
  recipientName: string;
  referenceId: string;
}

interface InvitationSenderProps {
  orderId: string;
  customerEmail: string;
  customerName: string;
}

const InvitationSender: React.FC<InvitationSenderProps> = ({
  orderId,
  customerEmail,
  customerName,
}) => {
  useEffect(() => {
    if (typeof window !== "undefined" && window.trustpilot) {
      const invitationData: InvitationData = {
        recipientEmail: customerEmail,
        recipientName: customerName,
        referenceId: orderId,
      };

      try {
        window.trustpilot.invitation(invitationData);
        console.log(`Invito Trustpilot inviato per l'ordine: ${orderId}`);
      } catch (error) {
        console.error("Errore nell'invio dell'invito Trustpilot:", error);
      }
    } else {
      console.warn("Libreria Trustpilot non ancora caricata.");
    }
  }, [orderId, customerEmail, customerName]); // Esegui solo se cambiano i dati dell'ordine

  return null;
};

export default InvitationSender;
