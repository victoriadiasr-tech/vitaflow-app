import type { Metadata } from "next";
import "./globals.css";
import { Raleway } from "next/font/google";
import type { ReactNode } from "react";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VitaFlow",
  description: "Seu plano diário inteligente de saúde, treino e alimentação.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={raleway.className}>{children}</body>
    </html>
  );
}

