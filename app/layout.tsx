import type { Metadata, Viewport } from "next";
import { Anton, Pirata_One, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const pirata = Pirata_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pirata",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kuina.cl"),
  title: "KUINA · por siempre",
  description: "Por Siempre Tour 2026 · Santiago · Talca · Koncepción",
  openGraph: {
    title: "KUINA · por siempre",
    description: "Por Siempre Tour 2026 · Santiago · Talca · Koncepción",
    images: ["/img/perfil2.jpeg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KUINA · por siempre",
    description: "Por Siempre Tour 2026 · Santiago · Talca · Koncepción",
    images: ["/img/perfil2.jpeg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000814",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${anton.variable} ${pirata.variable} ${cormorant.variable} ${jetbrains.variable} bg-void text-white overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
