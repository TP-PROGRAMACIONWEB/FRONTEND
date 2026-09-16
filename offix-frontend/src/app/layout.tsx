import type { Metadata } from "next";
import { Montserrat, Raleway } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["600", "800"],
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OFFIX",
  description: "Plataforma para conectar clientes con profesionales de oficios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${raleway.variable}`}>
      <body>{children}</body>
    </html>
  );
}
