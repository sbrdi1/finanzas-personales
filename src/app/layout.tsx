import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finova | Finanzas personales",
  description: "Controla tus ingresos, gastos y presupuestos desde un solo lugar.",
  applicationName: "Finova",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={geist.variable}
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}
