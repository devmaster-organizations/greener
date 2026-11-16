
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "GreenER",
  description: "Monitoramento do impacto ambiental das aplicações.",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}

