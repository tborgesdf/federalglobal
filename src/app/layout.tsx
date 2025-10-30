import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DomainRouter from "../components/DomainRouter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Federal Global - Sistema de Inteligência Empresarial",
  description: "Sistema avançado de inteligência e contrainteligência empresarial desenvolvido pela DeltaFox Consultoria",
  keywords: "inteligência empresarial, contrainteligência, segurança corporativa, DeltaFox",
  authors: [{ name: "DeltaFox Consultoria" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DomainRouter>{children}</DomainRouter>
      </body>
    </html>
  );
}
