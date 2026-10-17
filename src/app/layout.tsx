import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline} | Pune Real Estate`,
    template: `%s | ${siteConfig.name} Pune`,
  },
  description: siteConfig.description,
  keywords: [
    "Arth Properties",
    "Monali Khedekar",
    "Real Estate Pune",
    "Flats for Sale in Baner",
    "Luxury Apartments Pune",
    "Properties in Kharadi",
    "Koregaon Park Real Estate",
    "Commercial Properties Pune",
    "Plots for Sale Pune",
    "Buy Sell Rent Pune",
  ],
  authors: [{ name: "Monali Khedekar - Arth Properties" }],
  creator: "Arth Properties",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-[#102D50] font-sans antialiased min-h-screen flex flex-col selection:bg-[#D71935] selection:text-white">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
