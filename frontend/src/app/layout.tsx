import type { Metadata } from "next";
import { ThemeProvider } from "@/contexts";
import Providers from '@/components/Providers'

import "./globals.css";


export const metadata: Metadata = {
  title: "FVPM - Software",
  description: "Esta app esta pensada para gestionar los procesos de la fundacion FVPM",
  icons: {
    icon: '/img/logo/favicon.png',
    shortcut: '/img/logo/favicon.png',
    apple: '/img/logo/favicon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
