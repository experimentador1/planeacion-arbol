import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Strategic Tree Builder — STB v1.0",
  description: "Sistema multiagente para análisis estratégico institucional. Árbol de Problemas y Objetivos bajo Marco Lógico · DACYTI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className={`min-h-full flex flex-col ${inter.className}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
