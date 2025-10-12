import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConsoleFooter } from "@/components/footer/Footer";
import { Header } from "@/components/home/header/Header";
import { Toaster } from "react-hot-toast";
import "../i18n";
import Providers from "@/redux/Provider";
import CookieBanner from "./CookieBanner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Console Locker",
  description: "Console Locker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${poppins.className}`}
        // ELIMINATO: upword-verified='true'
        data-new-gr-c-s-check-loaded="14.1233.0"
        data-gr-ext-installed=""
        cz-shortcut-listen="true">
        <Toaster position="top-center" />
        <Providers>
          <AntdRegistry>
            <Header />
            {children}
            <ConsoleFooter />
          </AntdRegistry>
        </Providers>

        <CookieBanner />
      </body>
    </html>
  );
}
