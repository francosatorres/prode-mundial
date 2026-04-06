import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "ProdeMundial 2026 — El Prode del Mundial",
  description: "Hacé tus pronósticos del Mundial 2026, compite con amigos y seguí el ranking en tiempo real.",
  keywords: "prode, mundial, 2026, pronósticos, fútbol, argentina",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="relative z-10">
        <Navbar />
        <main className="min-h-[calc(100vh-64px-80px)] relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
