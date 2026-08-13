import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://enterent.org"),
  title: "EnterRent — Verified Airbnb Host Swap & Backup Network",
  description:
    "A trusted network for verified Airbnb hosts to swap stays with hosts abroad or find emergency backup hosting when a confirmed booking can't be honored.",
  openGraph: {
    title: "EnterRent — Verified Airbnb Host Swap & Backup Network",
    description:
      "Connect your Airbnb listing, get verified, and swap stays or find emergency backup hosting with hosts around the world.",
    url: "https://enterent.org",
    siteName: "EnterRent",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
