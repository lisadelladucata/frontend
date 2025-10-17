"use client";

import React, { useEffect } from "react";

declare global {
  interface Window {
    Trustpilot: {
      loadWidgets: () => void;
    };
  }
}

const TrustpilotWidget = () => {
  useEffect(() => {
    if (window.Trustpilot) {
      window.Trustpilot.loadWidgets();
    }
  }, []);

  return (
    <div className="my-8 max-w-xl mx-auto">
      <div
        className="trustpilot-widget"
        data-locale="it-IT"
        data-template-id="56278e9abfbbba0bdcd568bc"
        data-businessunit-id="675f162688bd057610708335"
        data-style-height="52px"
        data-style-width="100%"
        data-token="0cf1aecb-3442-45bd-baf9-57df39987527">
        <a
          href="https://it.trustpilot.com/review/consolelocker.it"
          target="_blank"
          rel="noopener">
          Trustpilot
        </a>
      </div>
    </div>
  );
};

export default TrustpilotWidget;
