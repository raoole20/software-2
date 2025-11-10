import type { Metadata } from "next";
import { ThemeProvider } from "@/contexts";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";


export const metadata: Metadata = {
  title: "FVPM - Software",
  description: "Esta app esta pensada para gestionar los procesos de la fundacion FVPM",
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
        <ThemeProvider attribute={'class'} defaultTheme={'system'} enableSystem>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
