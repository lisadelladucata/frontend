"use client";

import CookieConsent from "react-cookie-consent";
import Link from "next/link";

export default function CookieBanner() {
  return (
    <CookieConsent
      debug={false}
      buttonText="Accetta"
      cookieName="myWebsiteCookieConsent"
      style={{
        background: "#404040",
        color: "white",
        borderRadius: "8px",
        padding: "1rem",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
      buttonStyle={{
        background: "#00A67E",
        color: "white",
        borderRadius: "4px",
        padding: "0.5rem 1rem",
        fontSize: "13px",
      }}
      expires={150}>
      Questo sito web utilizza i cookie per migliorare l'esperienza utente.
      <Link href="/cookie-policy">
        <span style={{ fontSize: "10px", color: "white" }}>
          Per saperne di più
        </span>
      </Link>
    </CookieConsent>
  );
}
